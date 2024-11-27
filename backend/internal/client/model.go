package client

import (
	"gorm.io/gorm"
	"realtor-crm-backend/internal/deal"
)

type Client struct {
	gorm.Model
	UserId  uint        `json:"userId"`
	Name    string      `json:"name"`
	Surname string      `json:"surname"`
	Email   string      `json:"email" gorm:"uniqueIndex"`
	Phone   string      `json:"phone"`
	Address string      `json:"address"`
	Notes   string      `json:"notes"`
	Deals   []deal.Deal `json:"deals" gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func NewClient(name, surname, email, phone, address, notes string, userId uint) *Client {
	return &Client{
		UserId:  userId,
		Name:    name,
		Surname: surname,
		Email:   email,
		Phone:   phone,
		Address: address,
		Notes:   notes,
	}
}
