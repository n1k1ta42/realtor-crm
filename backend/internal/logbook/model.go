package logbook

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Logbook struct {
	gorm.Model
	UserId  uint           `json:"userId"`
	Details datatypes.JSON `json:"details"`
}
