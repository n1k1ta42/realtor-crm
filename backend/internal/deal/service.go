package deal

import (
	"errors"
	"gorm.io/gorm"
	"log"
)

type ServiceDeal struct {
	DealRepository *RepositoryDeal
}

func NewServiceDeal(dealRepository *RepositoryDeal) *ServiceDeal {
	return &ServiceDeal{
		DealRepository: dealRepository,
	}
}

func (s *ServiceDeal) List(limit, offset int) (*ListDealResponse, error) {
	deals, err := s.DealRepository.GetDeals(limit, offset)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	count, err := s.DealRepository.GetDealsCount()
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	return &ListDealResponse{
		Deals: deals,
		Count: count,
	}, nil
}

func (s *ServiceDeal) Create(userId, clientId, objectId uint) (*Deal, error) {
	deal := NewDeal(userId, clientId, objectId)
	_, err := s.DealRepository.Create(deal)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to create deal")
	}
	return deal, nil
}

func (s *ServiceDeal) Update(id uint, body UpdateDealRequest) (*Deal, error) {
	existedDeal, err := s.DealRepository.ById(id)
	if existedDeal == nil {
		return nil, errors.New("deal not found")
	}
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to update deal")
	}
	deal, err := s.DealRepository.Update(&Deal{
		Model:    gorm.Model{ID: id},
		UserId:   body.UserId,
		ClientId: body.ClientId,
		ObjectId: body.ObjectId,
	})
	if err != nil {
		return nil, errors.New("failed to update deal")
	}
	return deal, nil
}

func (s *ServiceDeal) Delete(id uint) error {
	_, err := s.DealRepository.ById(id)
	if err != nil {
		return errors.New("deal not found")
	}
	err = s.DealRepository.Delete(id)
	if err != nil {
		return errors.New("failed to delete deal")
	}
	return nil
}
