package com.ead.authuser.filters;

import com.ead.authuser.enums.UserStatus;
import com.ead.authuser.enums.UserType;

public record UserFilterDto (UserType userType, UserStatus userStatus, String email){
}
