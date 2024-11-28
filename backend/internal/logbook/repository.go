package logbook

import (
	"realtor-crm-backend/pkg/db"
)

type RepositoryLogbook struct {
	Database *db.Db
}

func NewRepositoryLogbook(database *db.Db) *RepositoryLogbook {
	return &RepositoryLogbook{
		Database: database,
	}
}

func (r *RepositoryLogbook) Create(logbook *Logbook) (*Logbook, error) {
	result := r.Database.DB.Create(logbook)
	if result.Error != nil {
		return nil, result.Error
	}
	return logbook, nil
}
