package main

import (
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
	"realtor-crm-backend/internal/client"
	"realtor-crm-backend/internal/deal"
	"realtor-crm-backend/internal/logbook"
	"realtor-crm-backend/internal/object"
	"realtor-crm-backend/internal/organization"
	"realtor-crm-backend/internal/user"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err.Error())
	}
	db, err := gorm.Open(postgres.Open(os.Getenv("DSN")), &gorm.Config{})
	if err != nil {
		panic(err.Error())
	}
	err = db.AutoMigrate(
		&organization.Organization{},
		&user.User{},
		&client.Client{},
		&object.Object{},
		&deal.Deal{},
		&logbook.Logbook{},
	)
	if err != nil {
		panic(err.Error())
	}
}
