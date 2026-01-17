package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.report.DashboardResponse;
import com.microfinancemanager.microfinancemanager.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Reports", description = "Reporting and analytics endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ReportController {

    private final ReportService reportService;

    @Operation(
        summary = "Get admin dashboard statistics",
        description = "Retrieve comprehensive dashboard statistics including users, accounts, transactions, loans, and repayments. Admin only."
    )
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardResponse> getAdminDashboard() {
        DashboardResponse dashboard = reportService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
