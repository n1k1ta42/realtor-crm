package user

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	OrganizationId uint   `json:"organization_id"`
	Name           string `json:"name"`
	Surname        string `json:"surname"`
	Email          string `json:"email" gorm:"uniqueIndex"`
	PasswordHash   string `json:"password_hash"`
}

func NewUser(name, surname, email, password string, organizationsId uint) *User {
	return &User{
		Name:           name,
		Surname:        surname,
		Email:          email,
		PasswordHash:   password,
		OrganizationId: organizationsId,
	}
}
