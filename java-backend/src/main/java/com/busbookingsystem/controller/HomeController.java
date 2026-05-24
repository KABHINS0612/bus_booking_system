package com.busbookingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.busbookingsystem.entity.Role;
import com.busbookingsystem.security.SecurityUtils;
import com.busbookingsystem.service.DriverService;
import com.busbookingsystem.service.TripService;
import com.busbookingsystem.service.UserService;
import com.busbookingsystem.service.VehicleService;

import jakarta.servlet.http.HttpSession;

@Controller
public class HomeController {

    @Autowired
    private TripService tripService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String home(HttpSession session, Model model,
                       @RequestParam(required = false, defaultValue = "book") String tab) {
        if (SecurityUtils.hasRole(Role.ADMIN) || session.getAttribute("admin") != null) {
            model.addAttribute("view", "admin");
            model.addAttribute("guestTab", "user");
            model.addAttribute("dashboard", true);
            model.addAttribute("trips", tripService.getAllTrips());
            model.addAttribute("vehicles", vehicleService.getAllVehicles());
            model.addAttribute("drivers", driverService.getAllDrivers());
            return "index";
        }

        Long userId = (Long) session.getAttribute("user_id");
        if (userId == null && SecurityUtils.isAuthenticated() && !SecurityUtils.hasRole(Role.ADMIN)) {
            userId = userService.findByUsername(SecurityUtils.currentUsername())
                    .map(u -> u.getId())
                    .orElse(null);
        }
        if (userId != null) {
            model.addAttribute("view", "user");
            model.addAttribute("guestTab", "user");
            model.addAttribute("username", session.getAttribute("username"));
            model.addAttribute("activeTab", tab);
            model.addAttribute("vehicles", vehicleService.getAllVehicles());
            model.addAttribute("drivers", driverService.getAllDrivers());
            model.addAttribute("trips", tripService.getTripsByUserId(userId));
            return "index";
        }

        model.addAttribute("view", "guest");
        model.addAttribute("guestTab", "admin".equals(tab) ? "admin" : "user");
        return "index";
    }

    @GetMapping({"/trip_details", "/trip_history", "/admin", "/admin/dashboard"})
    public String legacyRoutes() {
        return "redirect:/";
    }
}

