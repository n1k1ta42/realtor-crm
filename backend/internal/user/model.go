package user

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name         string `json:"name"`
	Surname      string `json:"surname"`
	Email        string `json:"email" gorm:"uniqueIndex"`
	PasswordHash string `json:"password_hash"`
}

func NewUser(name, surname, email, password string) *User {
	return &User{
		Name:         name,
		Surname:      surname,
		Email:        email,
		PasswordHash: password,
	}
}
