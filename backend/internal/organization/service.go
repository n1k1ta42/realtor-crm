package organization

import (
	"errors"
	"gorm.io/gorm"
	"log"
)

type ServiceOrganization struct {
	OrganizationRepository *RepositoryOrganization
}

func NewServiceOrganization(organizationRepository *RepositoryOrganization) *ServiceOrganization {
	return &ServiceOrganization{
		OrganizationRepository: organizationRepository,
	}
}

func (s *ServiceOrganization) List(limit, offset int, orderBy, direction string) (*ListOrganizationResponse, error) {
	organizations, err := s.OrganizationRepository.GetOrganizations(limit, offset, orderBy, direction)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	count, err := s.OrganizationRepository.GetOrganizationsCount()
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("something went wrong")
	}
	return &ListOrganizationResponse{
		Organizations: organizations,
		Count:         count,
	}, nil
}

func (s *ServiceOrganization) Create(name, address, phone, email string) (*Organization, error) {
	existedOrganization, _ := s.OrganizationRepository.ByEmail(email)
	if existedOrganization != nil {
		return nil, errors.New("organization with this email already exists")
	}
	organization := NewOrganization(name, address, phone, email)
	_, err := s.OrganizationRepository.Create(organization)
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to create organization")
	}
	return organization, nil
}

func (s *ServiceOrganization) Update(id uint, body UpdateOrganizationRequest) (*Organization, error) {
	existedUser, err := s.OrganizationRepository.ById(id)
	if existedUser == nil {
		return nil, errors.New("organization not found")
	}
	if err != nil {
		log.Println(err.Error())
		return nil, errors.New("failed to update organization")
	}
	organization, err := s.OrganizationRepository.Update(&Organization{
		Model:   gorm.Model{ID: id},
		Name:    body.Name,
		Address: body.Address,
		Email:   body.Email,
		Phone:   body.Phone,
	})
	if err != nil {
		return nil, errors.New("failed to update organization")
	}
	return organization, nil
}

func (s *ServiceOrganization) Delete(id uint) error {
	_, err := s.OrganizationRepository.ById(id)
	if err != nil {
		return errors.New("organization not found")
	}
	err = s.OrganizationRepository.Delete(id)
	if err != nil {
		return errors.New("failed to delete organization")
	}
	return nil
}
