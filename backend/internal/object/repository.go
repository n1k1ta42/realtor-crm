package object

import (
	"gorm.io/gorm/clause"
	"realtor-crm-backend/pkg/db"
)

type RepositoryObject struct {
	Database *db.Db
}

func NewRepositoryObject(database *db.Db) *RepositoryObject {
	return &RepositoryObject{
		Database: database,
	}
}

func (r *RepositoryObject) GetObjects(limit, offset int) ([]Object, error) {
	var objects []Object
	result := r.Database.DB.
		Preload("Deals").
		Table("objects").
		Where("deleted_at IS NULL").
		Order("id desc").
		Limit(limit).
		Offset(offset).
		Find(&objects)
	if result.Error != nil {
		return nil, result.Error
	}
	return objects, nil
}

func (r *RepositoryObject) GetObjectsCount() (int64, error) {
	var count int64
	result := r.Database.DB.
		Table("objects").
		Where("deleted_at IS NULL").
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (r *RepositoryObject) ById(id uint) (*Object, error) {
	var client Object
	result := r.Database.DB.First(&client, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &client, nil
}

func (r *RepositoryObject) ByAddress(address string) (*Object, error) {
	var client Object
	result := r.Database.DB.First(&client, "address = ?", address)
	if result.Error != nil {
		return nil, result.Error
	}
	return &client, nil
}

func (r *RepositoryObject) Create(client *Object) (*Object, error) {
	result := r.Database.DB.Create(client)
	if result.Error != nil {
		return nil, result.Error
	}
	return client, nil
}

func (r *RepositoryObject) Update(client *Object) (*Object, error) {
	result := r.Database.DB.Clauses(clause.Returning{}).Updates(client)
	if result.Error != nil {
		return nil, result.Error
	}
	return client, nil
}

func (r *RepositoryObject) Delete(id uint) error {
	result := r.Database.DB.Delete(&Object{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
