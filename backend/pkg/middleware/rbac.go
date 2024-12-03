package middleware

import (
	"net/http"
	"realtor-crm-backend/pkg/res"
)

func Rbac(next http.Handler, allowedRoles []string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userRole, ok := r.Context().Value(ContextRoleKey).(string)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		for _, allowedRole := range allowedRoles {
			if allowedRole == userRole {
				next.ServeHTTP(w, r)
				return
			}
		}
		res.Json(w, http.StatusForbidden, "forbidden")
	})
}
