package auth

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
	"log"
	"realtor-crm-backend/internal/user"
)

type ServiceAuth struct {
	UserRepository *user.RepositoryUser
}

func NewServiceAuth(userRepository *user.RepositoryUser) *ServiceAuth {
	return &ServiceAuth{
		UserRepository: userRepository,
	}
}

func (s *ServiceAuth) Login(email, password string) (string, error) {
	existedUser, err := s.UserRepository.ByEmail(email)
	if existedUser == nil {
		return "", errors.New("wrong credentials")
	}
	if err != nil {
		log.Println(err.Error())
		return "", errors.New("wrong credentials")
	}
	err = bcrypt.CompareHashAndPassword([]byte(existedUser.PasswordHash), []byte(password))
	if err != nil {
		log.Println(err.Error())
		return "", errors.New("wrong credentials")
	}
	return existedUser.Email, nil
}
