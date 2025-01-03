package user

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"realtor-crm-backend/pkg/db"
)

type RepositoryUser struct {
	Database *db.Db
}

func NewRepositoryUser(database *db.Db) *RepositoryUser {
	return &RepositoryUser{
		Database: database,
	}
}

func (r *RepositoryUser) GetUsers(limit, offset, organizationId int, orderBy, direction string) ([]User, error) {
	var users []User
	query := r.Database.DB.Table("users").
		Preload("Clients").
		Preload("Objects").
		Preload("Deals").
		Where("deleted_at IS NULL").
		Session(&gorm.Session{})
	if organizationId != 0 {
		query = query.Where("organization_id = ?", organizationId)
	}
	result := query.
		Order(orderBy + " " + direction).
		Limit(limit).
		Offset(offset).
		Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func (r *RepositoryUser) GetUsersCount() (int64, error) {
	var count int64
	result := r.Database.DB.Table("users").
		Table("users").
		Where("deleted_at IS NULL").
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (r *RepositoryUser) List() (*[]User, error) {
	var users []User
	result := r.Database.DB.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return &users, nil
}

func (r *RepositoryUser) ById(id uint) (*User, error) {
	var user User
	result := r.Database.DB.First(&user, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *RepositoryUser) ByEmail(email string) (*User, error) {
	var user User
	result := r.Database.DB.First(&user, "email = ?", email)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *RepositoryUser) Create(user *User) (*User, error) {
	result := r.Database.DB.Create(user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func (r *RepositoryUser) Update(user *User) (*User, error) {
	result := r.Database.DB.Clauses(clause.Returning{}).Updates(user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func (r *RepositoryUser) Delete(id uint) error {
	result := r.Database.DB.Delete(&User{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
