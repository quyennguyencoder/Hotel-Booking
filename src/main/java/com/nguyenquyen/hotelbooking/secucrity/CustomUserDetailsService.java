package com.nguyenquyen.hotelbooking.secucrity;

import com.nguyenquyen.hotelbooking.entities.User;
import com.nguyenquyen.hotelbooking.exceptions.NotFoundException;
import com.nguyenquyen.hotelbooking.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return CustomUserDetails.builder()
                .user(user)
                .build();
    }
}
