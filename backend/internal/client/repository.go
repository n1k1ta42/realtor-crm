package client

import (
	"gorm.io/gorm/clause"
	"realtor-crm-backend/pkg/db"
)

type RepositoryClient struct {
	Database *db.Db
}

func NewRepositoryClient(database *db.Db) *RepositoryClient {
	return &RepositoryClient{
		Database: database,
	}
}

func (r *RepositoryClient) GetClients(limit, offset int) ([]Client, error) {
	var clients []Client
	result := r.Database.DB.
		Preload("Deals").
		Table("clients").
		Where("deleted_at IS NULL").
		Order("id desc").
		Limit(limit).
		Offset(offset).
		Find(&clients)
	if result.Error != nil {
		return nil, result.Error
	}
	return clients, nil
}

func (r *RepositoryClient) GetClientsCount() (int64, error) {
	var count int64
	result := r.Database.DB.
		Table("clients").
		Where("deleted_at IS NULL").
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (r *RepositoryClient) ById(id uint) (*Client, error) {
	var client Client
	result := r.Database.DB.First(&client, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &client, nil
}

func (r *RepositoryClient) ByEmail(email string) (*Client, error) {
	var client Client
	result := r.Database.DB.First(&client, "email = ?", email)
	if result.Error != nil {
		return nil, result.Error
	}
	return &client, nil
}

func (r *RepositoryClient) Create(client *Client) (*Client, error) {
	result := r.Database.DB.Create(client)
	if result.Error != nil {
		return nil, result.Error
	}
	return client, nil
}

func (r *RepositoryClient) Update(client *Client) (*Client, error) {
	result := r.Database.DB.Clauses(clause.Returning{}).Updates(client)
	if result.Error != nil {
		return nil, result.Error
	}
	return client, nil
}

func (r *RepositoryClient) Delete(id uint) error {
	result := r.Database.DB.Delete(&Client{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
