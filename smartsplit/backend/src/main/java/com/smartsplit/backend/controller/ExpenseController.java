package com.smartsplit.backend.controller;

import com.smartsplit.backend.entity.Expense;
import com.smartsplit.backend.entity.User;
import com.smartsplit.backend.repository.UserRepository;
import com.smartsplit.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-dashboard")
    public Map<String, Object> getMyDashboard(Principal principal) {
        String email = principal.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Double> allBalances = expenseService.calculateBalances();
        Double myBalance = allBalances.getOrDefault(currentUser, 0.0);

        Map<String, Object> response = new HashMap<>();
        response.put("name", currentUser.getName());
        response.put("balance", myBalance);

        return response;
    }


    // GET endpoint for expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // POST endpoint for new expense
    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    // GET endpoint for balances (Who owes whom)
    @GetMapping("/balances")
    public Map<String, Double> getAllBalances() {
        return expenseService.calculateBalances();
    }

    // DELETE endpoint to remove an expense
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}