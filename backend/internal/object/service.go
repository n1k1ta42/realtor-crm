package object

import (
	"errors"
	"gorm.io/gorm"
	"log"
)

type ServiceObject struct {
	ObjectRepository *RepositoryObject
}

func NewServiceObject(objectRepository *RepositoryObject) *ServiceObject {
	return &ServiceObject{
		ObjectRepository: objectRepository,
	}
}

func (s *ServiceObject) List(limit, offset int) (*ListObjectResponse, error) {
	objects, err := s.ObjectRepository.GetObjects(limit, offset)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	count, err := s.ObjectRepository.GetObjectsCount()
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	return &ListObjectResponse{
		Objects: objects,
		Count:   count,
	}, nil
}

func (s *ServiceObject) Create(title, description, address, objectType, status string, price float64, creatorId uint) (*Object, error) {
	existedObject, _ := s.ObjectRepository.ByAddress(address)
	if existedObject != nil {
		return nil, errors.New("object with this address already exists")
	}
	object := NewObject(title, description, address, objectType, status, price, creatorId)
	_, err := s.ObjectRepository.Create(object)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to create object")
	}
	return object, nil
}

func (s *ServiceObject) Update(id uint, body UpdateObjectRequest) (*Object, error) {
	existedDeal, err := s.ObjectRepository.ById(id)
	if existedDeal == nil {
		return nil, errors.New("object not found")
	}
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to update object")
	}
	object, err := s.ObjectRepository.Update(&Object{
		Model:       gorm.Model{ID: id},
		Title:       body.Title,
		Description: body.Description,
		Address:     body.Address,
		Price:       body.Price,
		ObjectType:  body.ObjectType,
		Status:      body.Status,
	})
	if err != nil {
		return nil, errors.New("failed to update object")
	}
	return object, nil
}

func (s *ServiceObject) Delete(id uint) error {
	_, err := s.ObjectRepository.ById(id)
	if err != nil {
		return errors.New("object not found")
	}
	err = s.ObjectRepository.Delete(id)
	if err != nil {
		return errors.New("failed to delete object")
	}
	return nil
}
