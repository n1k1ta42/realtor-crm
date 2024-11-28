package main

import (
	"fmt"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/internal/auth"
	"realtor-crm-backend/internal/client"
	"realtor-crm-backend/internal/deal"
	"realtor-crm-backend/internal/logbook"
	"realtor-crm-backend/internal/object"
	"realtor-crm-backend/internal/organization"
	"realtor-crm-backend/internal/user"
	"realtor-crm-backend/pkg/db"
	"realtor-crm-backend/pkg/event/eventbus"
	"realtor-crm-backend/pkg/middleware"
)

func main() {
	conf := configs.LoadConfig()
	router := http.NewServeMux()
	newDb := db.NewDb(conf)
	eventBus := eventbus.NewEventBus()
	// Repositories
	userRepository := user.NewRepositoryUser(newDb)
	organizationRepository := organization.NewRepositoryOrganization(newDb)
	clientRepository := client.NewRepositoryClient(newDb)
	objectRepository := object.NewRepositoryObject(newDb)
	dealRepository := deal.NewRepositoryDeal(newDb)
	logbookRepository := logbook.NewRepositoryLogbook(newDb)
	// Services
	authService := auth.NewServiceAuth(userRepository)
	userService := user.NewServiceUser(&user.ServiceUserDeps{
		UserRepository: userRepository,
		EventBus:       eventBus,
	})
	organizationService := organization.NewServiceOrganization(organizationRepository)
	clientService := client.NewServiceClient(clientRepository)
	objectService := object.NewServiceObject(objectRepository)
	dealService := deal.NewServiceDeal(dealRepository)
	logbookService := logbook.NewServiceLogbook(&logbook.ServiceLogbookDeps{
		LogbookRepository: logbookRepository,
		EventBus:          eventBus,
	})
	// Handlers
	auth.NewHandlerAuth(router, auth.HandlerAuthDeps{
		Config:      conf,
		AuthService: authService,
	})
	user.NewHandlerUsers(router, user.HandlerUserDeps{
		UserRepository: userRepository,
		UserService:    userService,
		Config:         conf,
	})
	organization.NewHandlerOrganizations(router, organization.HandlerOrganizationDeps{
		OrganizationRepository: organizationRepository,
		OrganizationService:    organizationService,
		Config:                 conf,
	})
	client.NewHandlerClients(router, client.HandlerClientDeps{
		ClientRepository: clientRepository,
		ClientService:    clientService,
		Config:           conf,
	})
	object.NewHandlerObjects(router, object.HandlerObjectDeps{
		ObjectRepository: objectRepository,
		ObjectService:    objectService,
		Config:           conf,
	})
	deal.NewHandlerDeals(router, deal.HandlerDealDeps{
		DealRepository: dealRepository,
		DealService:    dealService,
		Config:         conf,
	})
	// Middlewares
	stack := middleware.Chain(
		middleware.CORS,
		middleware.Logging,
	)
	// Server
	server := &http.Server{
		Addr:    conf.Port,
		Handler: stack(router),
	}
	go logbookService.AddLogbook()
	fmt.Printf("Server in listening on PORT %s\n", conf.Port)
	err := server.ListenAndServe()
	if err != nil {
		panic(err.Error())
	}
}
