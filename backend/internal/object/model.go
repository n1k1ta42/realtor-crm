package object

import (
	"gorm.io/gorm"
	"realtor-crm-backend/internal/deal"
)

type Object struct {
	gorm.Model
	UserId      uint        `json:"userId"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Address     string      `json:"address" gorm:"uniqueIndex"`
	Price       float64     `json:"price"`
	ObjectType  string      `json:"objectType"`
	Status      string      `json:"status"`
	Deals       []deal.Deal `json:"deals" gorm:"constraints:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func NewObject(title, description, address, objectType, status string, price float64, userId uint) *Object {
	return &Object{
		UserId:      userId,
		Title:       title,
		Description: description,
		Address:     address,
		Price:       price,
		ObjectType:  objectType,
		Status:      status,
	}
}
