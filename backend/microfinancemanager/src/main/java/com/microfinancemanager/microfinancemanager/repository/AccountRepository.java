package com.microfinancemanager.microfinancemanager.repository;

import com.microfinancemanager.microfinancemanager.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    List<Account> findByUser_UserId(Long userId);
    
    List<Account> findByUser_UserIdAndStatus(Long userId, Account.AccountStatus status);
}
