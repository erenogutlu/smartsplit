package com.smartsplit.backend.service;

import com.smartsplit.backend.entity.Expense;
import com.smartsplit.backend.entity.User;
import com.smartsplit.backend.repository.ExpenseRepository;
import com.smartsplit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository; // Added to get user count

    // Fetch all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Save a new expense
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // CORE LOGIC: Calculate who owes how much
    public Map<String, Double> calculateBalances() {
        List<User> users = userRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();

        Map<String, Double> balances = new HashMap<>();
        if (users.isEmpty()) return balances; // No users, no balances

        // 1. Calculate total spent
        double totalExpense = expenses.stream()
                .mapToDouble(e -> e.getAmount().doubleValue())
                .sum();

        // 2. Calculate average per person
        double perPerson = totalExpense / users.size();

        // 3. Calculate balance for each user
        for (User user : users) {
            // Find how much this specific user paid in total
            double paidByUser = expenses.stream()
                    .filter(e -> e.getPaidBy().getId().equals(user.getId()))
                    .mapToDouble(e -> e.getAmount().doubleValue())
                    .sum();

            // Balance = What they paid - What they should have paid
            double balance = paidByUser - perPerson;

            // Math.round is used to keep 2 decimal places (e.g., 12.75)
            balances.put(user.getName(), Math.round(balance * 100.0) / 100.0);
        }

        return balances;
    }
}