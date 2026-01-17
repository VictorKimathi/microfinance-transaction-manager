package com.microfinancemanager.microfinancemanager.repository;

import com.microfinancemanager.microfinancemanager.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    
    List<Loan> findByUser_UserId(Long userId);
    
    List<Loan> findByUser_UserIdAndStatus(Long userId, Loan.LoanStatus status);
    
    List<Loan> findByStatus(Loan.LoanStatus status);
}
