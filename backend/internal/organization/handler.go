package organization

import (
	"log"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/pkg/middleware"
	"realtor-crm-backend/pkg/req"
	"realtor-crm-backend/pkg/res"
	"strconv"
)

type HandlerOrganizationDeps struct {
	OrganizationRepository *RepositoryOrganization
	OrganizationService    *ServiceOrganization
	Config                 *configs.Config
}

type HandlerOrganization struct {
	OrganizationRepository *RepositoryOrganization
	OrganizationService    *ServiceOrganization
}

func NewHandlerOrganizations(router *http.ServeMux, deps HandlerOrganizationDeps) {
	handler := &HandlerOrganization{
		OrganizationRepository: deps.OrganizationRepository,
		OrganizationService:    deps.OrganizationService,
	}
	router.Handle("GET /organization/list", middleware.IsAuthed(middleware.Rbac(handler.List(), []string{"admin"}), deps.Config))
	router.Handle("GET /organization/{id}", middleware.IsAuthed(middleware.Rbac(handler.ById(), []string{"admin"}), deps.Config))
	router.Handle("POST /organization", middleware.IsAuthed(middleware.Rbac(handler.Create(), []string{"admin"}), deps.Config))
	router.Handle("PATCH /organization/{id}", middleware.IsAuthed(middleware.Rbac(handler.Update(), []string{"admin"}), deps.Config))
	router.Handle("DELETE /organization/{id}", middleware.IsAuthed(middleware.Rbac(handler.Delete(), []string{"admin"}), deps.Config))
}

func (h *HandlerOrganization) List() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusBadRequest, "invalid limit")
			return
		}
		offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusBadRequest, "invalid offset")
			return
		}
		orderBy := r.URL.Query().Get("orderBy")
		if orderBy == "" {
			orderBy = "name"
		}
		direction := r.URL.Query().Get("direction")
		if direction == "" {
			direction = "asc"
		}
		list, err := h.OrganizationService.List(limit, offset, orderBy, direction)
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, list)
	}
}

func (h *HandlerOrganization) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		organization, err := h.OrganizationRepository.ById(uint(id))
		if err != nil {
			res.Json(w, http.StatusNotFound, "organization not found")
			return
		}
		res.Json(w, http.StatusOK, organization)
	}
}

func (h *HandlerOrganization) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[CreateOrganizationRequest](&w, r)
		if err != nil {
			return
		}
		createdOrganization, err := h.OrganizationService.Create(body.Name, body.Address, body.Phone, body.Email)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusCreated, createdOrganization)
	}
}

func (h *HandlerOrganization) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[UpdateOrganizationRequest](&w, r)
		if err != nil {
			return
		}
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		organization, err := h.OrganizationService.Update(uint(id), *body)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusOK, organization)
	}
}

func (h *HandlerOrganization) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		err = h.OrganizationService.Delete(uint(id))
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, "organization deleted")
	}
}
