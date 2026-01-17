package com.microfinancemanager.microfinancemanager.repository;

import com.microfinancemanager.microfinancemanager.model.Repayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    
    List<Repayment> findByLoan_LoanId(Long loanId);
    
    Page<Repayment> findByLoan_LoanId(Long loanId, Pageable pageable);
    
    boolean existsByReceiptNumber(String receiptNumber);
}
