package client

import (
	"errors"
	"gorm.io/gorm"
	"log"
)

type ServiceClient struct {
	ClientRepository *RepositoryClient
}

func NewServiceClient(clientRepository *RepositoryClient) *ServiceClient {
	return &ServiceClient{
		ClientRepository: clientRepository,
	}
}

func (s *ServiceClient) List(limit, offset int) (*ListClientResponse, error) {
	clients, err := s.ClientRepository.GetClients(limit, offset)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	count, err := s.ClientRepository.GetClientsCount()
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	return &ListClientResponse{
		Clients: clients,
		Count:   count,
	}, nil
}

func (s *ServiceClient) Create(name, surname, email, phone, address, notes string, creatorId uint) (*Client, error) {
	existedClient, _ := s.ClientRepository.ByEmail(email)
	if existedClient != nil {
		return nil, errors.New("client with this email already exists")
	}
	client := NewClient(name, surname, email, phone, address, notes, creatorId)
	_, err := s.ClientRepository.Create(client)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to create client")
	}
	return client, nil
}

func (s *ServiceClient) Update(id uint, body UpdateClientRequest) (*Client, error) {
	existedClient, err := s.ClientRepository.ById(id)
	if existedClient == nil {
		return nil, errors.New("client not found")
	}
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to update client")
	}
	client, err := s.ClientRepository.Update(&Client{
		Model:   gorm.Model{ID: id},
		Name:    body.Name,
		Surname: body.Surname,
		Address: body.Address,
		Email:   body.Email,
		Phone:   body.Phone,
		Notes:   body.Notes,
	})
	if err != nil {
		return nil, errors.New("failed to update client")
	}
	return client, nil
}

func (s *ServiceClient) Delete(id uint) error {
	_, err := s.ClientRepository.ById(id)
	if err != nil {
		return errors.New("client not found")
	}
	err = s.ClientRepository.Delete(id)
	if err != nil {
		return errors.New("failed to delete client")
	}
	return nil
}
