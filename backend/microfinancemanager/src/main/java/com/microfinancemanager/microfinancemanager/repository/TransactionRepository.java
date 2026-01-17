package com.microfinancemanager.microfinancemanager.repository;

import com.microfinancemanager.microfinancemanager.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByAccount_AccountId(Long accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.accountId = :accountId AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:startDate IS NULL OR t.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR t.timestamp <= :endDate) " +
           "ORDER BY t.timestamp DESC")
    Page<Transaction> findByAccountWithFilters(
        @Param("accountId") Long accountId,
        @Param("type") Transaction.TransactionType type,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT t FROM Transaction t WHERE t.account.user.userId = :userId AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:startDate IS NULL OR t.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR t.timestamp <= :endDate) " +
           "ORDER BY t.timestamp DESC")
    Page<Transaction> findByUserWithFilters(
        @Param("userId") Long userId,
        @Param("type") Transaction.TransactionType type,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    boolean existsByReferenceNumber(String referenceNumber);
}
