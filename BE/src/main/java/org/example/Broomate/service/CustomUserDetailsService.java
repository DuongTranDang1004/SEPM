package org.example.Broomate.service;

import org.example.Broomate.model.Account;
import org.example.Broomate.repository.GuestAuthRepository;
import org.example.Broomate.config.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * CustomUserDetailsService that uses EMAIL instead of username
 * Returns CustomUserDetails with userId, email, and role
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private GuestAuthRepository authRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find account by email (checks both tenants and landlords collections)
        Account account = authRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // ✅ Return CustomUserDetails with userId, email, role
        return new CustomUserDetails(
                account.getId(),                    // userId
                account.getEmail(),                 // email
                account.getPassword(),              // password
                account.getRole(),       // role (TENANT/LANDLORD)
                new ArrayList<>()                   // authorities
        );
    }
}