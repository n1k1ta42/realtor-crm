package organization

import (
	"gorm.io/gorm/clause"
	"realtor-crm-backend/pkg/db"
)

type RepositoryOrganization struct {
	Database *db.Db
}

func NewRepositoryOrganization(database *db.Db) *RepositoryOrganization {
	return &RepositoryOrganization{
		Database: database,
	}
}

func (r *RepositoryOrganization) GetOrganizations(limit, offset int) ([]Organization, error) {
	var organizations []Organization
	result := r.Database.DB.
		Preload("Users").
		Table("organizations").
		Where("deleted_at IS NULL").
		Order("id desc").
		Limit(limit).
		Offset(offset).
		Find(&organizations)
	if result.Error != nil {
		return nil, result.Error
	}
	return organizations, nil
}

func (r *RepositoryOrganization) GetOrganizationsCount() (int64, error) {
	var count int64
	result := r.Database.DB.
		Table("organizations").
		Where("deleted_at IS NULL").
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (r *RepositoryOrganization) ById(id uint) (*Organization, error) {
	var organization Organization
	result := r.Database.DB.First(&organization, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &organization, nil
}

func (r *RepositoryOrganization) ByEmail(email string) (*Organization, error) {
	var organization Organization
	result := r.Database.DB.First(&organization, "email = ?", email)
	if result.Error != nil {
		return nil, result.Error
	}
	return &organization, nil
}

func (r *RepositoryOrganization) Create(organization *Organization) (*Organization, error) {
	result := r.Database.DB.Create(organization)
	if result.Error != nil {
		return nil, result.Error
	}
	return organization, nil
}

func (r *RepositoryOrganization) Update(organization *Organization) (*Organization, error) {
	result := r.Database.DB.Clauses(clause.Returning{}).Updates(organization)
	if result.Error != nil {
		return nil, result.Error
	}
	return organization, nil
}

func (r *RepositoryOrganization) Delete(id uint) error {
	result := r.Database.DB.Delete(&Organization{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
