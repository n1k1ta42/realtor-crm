package organization

import (
	"gorm.io/gorm"
	"realtor-crm-backend/internal/user"
)

type Organization struct {
	gorm.Model
	Name    string      `json:"name"`
	Address string      `json:"address"`
	Phone   string      `json:"phone"`
	Email   string      `json:"email" gorm:"uniqueIndex"`
	Users   []user.User `json:"users" gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func NewOrganization(name, address, phone, email string) *Organization {
	return &Organization{
		Name:    name,
		Address: address,
		Phone:   phone,
		Email:   email,
	}
}
