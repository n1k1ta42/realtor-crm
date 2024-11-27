package deal

import (
	"gorm.io/gorm/clause"
	"realtor-crm-backend/pkg/db"
)

type RepositoryDeal struct {
	Database *db.Db
}

func NewRepositoryDeal(database *db.Db) *RepositoryDeal {
	return &RepositoryDeal{
		Database: database,
	}
}

func (r *RepositoryDeal) GetDeals(limit, offset int) ([]Deal, error) {
	var deals []Deal
	result := r.Database.DB.
		Table("deals").
		Where("deleted_at IS NULL").
		Order("id desc").
		Limit(limit).
		Offset(offset).
		Find(&deals)
	if result.Error != nil {
		return nil, result.Error
	}
	return deals, nil
}

func (r *RepositoryDeal) GetDealsCount() (int64, error) {
	var count int64
	result := r.Database.DB.
		Table("deals").
		Where("deleted_at IS NULL").
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (r *RepositoryDeal) ById(id uint) (*Deal, error) {
	var client Deal
	result := r.Database.DB.First(&client, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &client, nil
}

func (r *RepositoryDeal) ByAddress(address string) (*Deal, error) {
	var client Deal
	result := r.Database.DB.First(&client, "address = ?", address)
	if result.Error != nil {
		return nil, result.Error
	}
	return &client, nil
}

func (r *RepositoryDeal) Create(client *Deal) (*Deal, error) {
	result := r.Database.DB.Create(client)
	if result.Error != nil {
		return nil, result.Error
	}
	return client, nil
}

func (r *RepositoryDeal) Update(client *Deal) (*Deal, error) {
	result := r.Database.DB.Clauses(clause.Returning{}).Updates(client)
	if result.Error != nil {
		return nil, result.Error
	}
	return client, nil
}

func (r *RepositoryDeal) Delete(id uint) error {
	result := r.Database.DB.Delete(&Deal{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
