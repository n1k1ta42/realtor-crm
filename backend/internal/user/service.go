package user

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"math/rand"
	"realtor-crm-backend/pkg/event/eventbus"
)

type ServiceUserDeps struct {
	UserRepository *RepositoryUser
	EventBus       *eventbus.BusEvent
}

type ServiceUser struct {
	UserRepository *RepositoryUser
	EventBus       *eventbus.BusEvent
}

func NewServiceUser(deps *ServiceUserDeps) *ServiceUser {
	return &ServiceUser{
		UserRepository: deps.UserRepository,
		EventBus:       deps.EventBus,
	}
}

func (s *ServiceUser) List(limit, offset int) (*ListUserResponse, error) {
	users, err := s.UserRepository.GetUsers(limit, offset)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	count, err := s.UserRepository.GetUsersCount()
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	return &ListUserResponse{
		Users: users,
		Count: count,
	}, nil
}

func (s *ServiceUser) Create(name, surname, email, role string, creatorId uint) (string, error) {
	existedUser, _ := s.UserRepository.ByEmail(email)
	if existedUser != nil {
		return "", errors.New("user with this email already exists")
	}
	creator, err := s.UserRepository.ById(creatorId)
	if err != nil {
		log.Println(err.Error())
		//return "", errors.New("not found creator")
	}
	randomPassword, err := GenerateRandomPassword()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err.Error())
		return "", errors.New("failed to create user")
	}
	user := NewUser(name, surname, email, role, string(hashedPassword), creator.OrganizationId)
	_, err = s.UserRepository.Create(user)
	if err != nil {
		log.Println(err.Error())
		return "", errors.New("failed to create user")
	}
	data := make(map[string]interface{})
	newValue := map[string]interface{}{
		"email":   email,
		"name":    name,
		"surname": surname,
	}
	data["userId"] = creatorId
	data["oldValue"] = nil
	data["newValue"] = newValue
	go s.EventBus.Publish(eventbus.Event{
		Type: eventbus.UserCreated,
		Data: data,
	})
	return randomPassword, nil
}

func (s *ServiceUser) Update(id uint, body UpdateUserRequest, creatorId uint) (*User, error) {
	existedUser, err := s.UserRepository.ById(id)
	fmt.Println(id)
	if existedUser == nil {
		return nil, errors.New("user not found")
	}
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to update user")
	}
	user, err := s.UserRepository.Update(&User{
		Model:   gorm.Model{ID: id},
		Name:    body.Name,
		Surname: body.Surname,
		Email:   body.Email,
		Avatar:  body.Avatar,
	})
	if err != nil {
		return nil, errors.New("failed to update user")
	}
	data := make(map[string]interface{})
	oldValue := map[string]interface{}{
		"email":   existedUser.Email,
		"name":    existedUser.Name,
		"surname": existedUser.Surname,
	}
	newValue := map[string]interface{}{
		"email":   body.Email,
		"name":    body.Name,
		"surname": body.Surname,
	}

	data["userId"] = creatorId
	data["oldValue"] = oldValue
	data["newValue"] = newValue
	go s.EventBus.Publish(eventbus.Event{
		Type: eventbus.UserUpdated,
		Data: data,
	})
	return user, nil
}

func (s *ServiceUser) Delete(id, creatorId uint) error {
	_, err := s.UserRepository.ById(id)
	if err != nil {
		return errors.New("user not found")
	}
	err = s.UserRepository.Delete(id)
	if err != nil {
		return errors.New("failed to delete user")
	}
	data := make(map[string]interface{})
	newValue := map[string]interface{}{
		"deletedId": id,
	}
	data["userId"] = creatorId
	data["oldValue"] = nil
	data["newValue"] = newValue
	go s.EventBus.Publish(eventbus.Event{
		Type: eventbus.UserUpdated,
		Data: data,
	})
	return nil
}

func GenerateRandomPassword() (string, error) {
	randomPass := RandStringRunes(10)
	return randomPass, nil
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
