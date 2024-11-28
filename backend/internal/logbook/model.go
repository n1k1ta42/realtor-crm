package logbook

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Logbook struct {
	gorm.Model
	UserId    uint           `json:"userId"`
	Details   datatypes.JSON `json:"details"`
	EventType string         `json:"eventType"`
}

func NewLogbook(userId uint, details datatypes.JSON, eventType string) *Logbook {
	return &Logbook{
		UserId:    userId,
		Details:   details,
		EventType: eventType,
	}
}
