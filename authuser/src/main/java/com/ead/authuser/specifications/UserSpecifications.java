package com.ead.authuser.specifications;

import com.ead.authuser.enums.UserStatus;
import com.ead.authuser.enums.UserType;
import com.ead.authuser.filters.UserFilterDto;
import com.ead.authuser.models.UserModel;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecifications {

    public static Specification<UserModel> build(UserFilterDto userFilter) {
        return Specification.allOf(
                hasUserType(userFilter.userType()),
                hasUserStatus(userFilter.userStatus()),
                emailContains(userFilter.email())
        );
    }

    private static Specification<UserModel> hasUserType(UserType type) {
        if (type == null) return null;
        return (root, query, cb) -> cb.equal(root.get("userType"), type);
    }

    private static Specification<UserModel> hasUserStatus(UserStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("userStatus"), status);
    }

    private static Specification<UserModel> emailContains(String email) {
        if (email == null || email.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }
}
