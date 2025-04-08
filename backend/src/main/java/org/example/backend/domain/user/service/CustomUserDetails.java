package org.example.backend.domain.user.service;

import org.antlr.v4.runtime.misc.Array2DHashSet;
import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final User user;
    private final AccountLocal accountLocal;

    public CustomUserDetails(User user,AccountLocal accountLocal){
        this.user = user;
        this.accountLocal = accountLocal;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new Array2DHashSet<>();

        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole().toString();
            }
        });

        return collection;
    }

    @Override
    public String getUsername() {
        return accountLocal.getEmail();
    }

    @Override
    public String getPassword() {
        return accountLocal.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
