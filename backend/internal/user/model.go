package user

import (
	"gorm.io/gorm"
	"realtor-crm-backend/internal/client"
	"realtor-crm-backend/internal/deal"
	"realtor-crm-backend/internal/object"
)

type User struct {
	gorm.Model
	OrganizationId uint            `json:"organizationId"`
	Name           string          `json:"name"`
	Surname        string          `json:"surname"`
	Email          string          `json:"email" gorm:"uniqueIndex"`
	PasswordHash   string          `json:"-"`
	Role           string          `json:"role" gorm:"default:'worker'"`
	Avatar         string          `json:"avatar"`
	Clients        []client.Client `json:"clients" gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Objects        []object.Object `json:"objects" gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Deals          []deal.Deal     `json:"deals" gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func NewUser(name, surname, email, role, password string, organizationsId uint) *User {
	return &User{
		OrganizationId: organizationsId,
		Name:           name,
		Surname:        surname,
		Email:          email,
		PasswordHash:   password,
		Role:           role,
	}
}
