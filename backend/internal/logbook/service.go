package logbook

import (
	"encoding/json"
	"errors"
	"log"
	"realtor-crm-backend/pkg/event/eventbus"
)

type ServiceLogbookDeps struct {
	LogbookRepository *RepositoryLogbook
	EventBus          *eventbus.BusEvent
}

type ServiceLogbook struct {
	LogbookRepository *RepositoryLogbook
	EventBus          *eventbus.BusEvent
}

func NewServiceLogbook(deps *ServiceLogbookDeps) *ServiceLogbook {
	return &ServiceLogbook{
		LogbookRepository: deps.LogbookRepository,
		EventBus:          deps.EventBus,
	}
}

func (s *ServiceLogbook) AddLogbook() {
	for msg := range s.EventBus.Subscribe() {
		if msg.Type == eventbus.UserCreated || msg.Type == eventbus.UserUpdated || msg.Type == eventbus.UserDeleted {
			creatorId := msg.Data["userId"].(uint)
			delete(msg.Data, "userId")
			marshal, err := json.Marshal(msg.Data)
			if err != nil {
				log.Println(errors.New("failed to create marshal detail in logbook"))
				return
			}
			logbook := NewLogbook(creatorId, marshal, msg.Type)
			_, err = s.LogbookRepository.Create(logbook)
			if err != nil {
				log.Println(err.Error())
				log.Println(errors.New("failed to create logbook"))
				return
			}
		}
	}
}
