package deal

import (
	"gorm.io/gorm"
)

type Deal struct {
	gorm.Model
	UserId   uint `json:"userId"`
	ClientId uint `json:"clientId"`
	ObjectId uint `json:"objectId"`
}

func NewDeal(userId, clientId, objectId uint) *Deal {
	return &Deal{
		UserId:   userId,
		ClientId: clientId,
		ObjectId: objectId,
	}
}
