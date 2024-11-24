package main

import (
	"fmt"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/internal/auth"
	"realtor-crm-backend/internal/client"
	"realtor-crm-backend/internal/deal"
	"realtor-crm-backend/internal/object"
	"realtor-crm-backend/internal/organization"
	"realtor-crm-backend/internal/user"
	"realtor-crm-backend/pkg/db"
	"realtor-crm-backend/pkg/middleware"
)

func main() {
	conf := configs.LoadConfig()
	router := http.NewServeMux()
	newDb := db.NewDb(conf)
	// Repositories
	userRepository := user.NewRepositoryUser(newDb)
	organizationRepository := organization.NewRepositoryOrganization(newDb)
	// Services
	authService := auth.NewServiceAuth(userRepository)
	userService := user.NewServiceUser(userRepository)
	organizationService := organization.NewServiceOrganization(organizationRepository)
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
	client.NewHandlerClients(router, client.HandlerClientDeps{})
	object.NewHandlerObjects(router, object.HandlerObjectDeps{})
	deal.NewHandlerDeals(router, deal.HandlerDealDeps{})
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
	fmt.Printf("Server in listening on PORT %s\n", conf.Port)
	err := server.ListenAndServe()
	if err != nil {
		panic(err.Error())
	}
}
