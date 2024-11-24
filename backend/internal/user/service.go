package user

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"math/rand"
)

type ServiceUser struct {
	UserRepository *RepositoryUser
}

func NewServiceUser(userRepository *RepositoryUser) *ServiceUser {
	return &ServiceUser{
		UserRepository: userRepository,
	}
}

func (s *ServiceUser) List(limit, offset int) (*ListUserResponse, error) {
	users, err := s.UserRepository.GetLinks(limit, offset)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	count, err := s.UserRepository.GetLinksCount()
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	return &ListUserResponse{
		Users: users,
		Count: count,
	}, nil
}

func (s *ServiceUser) Create(name, surname, email string) (string, error) {
	existedUser, _ := s.UserRepository.ByEmail(email)
	if existedUser != nil {
		return "", errors.New("user already exists")
	}
	randomPassword, err := GenerateRandomPassword()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err.Error())
		return "", errors.New("failed to create user")
	}
	user := NewUser(name, surname, email, string(hashedPassword))
	_, err = s.UserRepository.Create(user)
	if err != nil {
		log.Println(err.Error())
		return "", errors.New("failed to create user")
	}
	return randomPassword, nil
}

func (s *ServiceUser) Update(id uint, body UpdateUserRequest) (*User, error) {
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
	})
	if err != nil {
		return nil, errors.New("failed to update user")
	}
	return user, nil
}

func (s *ServiceUser) Delete(id uint) error {
	_, err := s.UserRepository.ById(id)
	if err != nil {
		return errors.New("user not found")
	}
	err = s.UserRepository.Delete(id)
	if err != nil {
		return errors.New("failed to delete user")
	}
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
