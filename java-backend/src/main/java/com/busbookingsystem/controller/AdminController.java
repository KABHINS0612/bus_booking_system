package com.busbookingsystem.controller;

import com.busbookingsystem.entity.Role;
import com.busbookingsystem.security.SecurityUtils;
import com.busbookingsystem.service.DriverService;
import com.busbookingsystem.service.TripService;
import com.busbookingsystem.service.VehicleService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private TripService tripService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public String adminLogin(@RequestParam String username,
                             @RequestParam String password,
                             HttpServletRequest request,
                             RedirectAttributes redirectAttributes) {
        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username.trim(), password));

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            if (!isAdmin) {
                SecurityContextHolder.clearContext();
                redirectAttributes.addFlashAttribute("error", "Admin access required");
                return "redirect:/?tab=admin";
            }

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            request.getSession(true).setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context);

            request.getSession().removeAttribute("user_id");
            request.getSession().removeAttribute("username");
            request.getSession().setAttribute("admin", true);
            return "redirect:/";
        } catch (BadCredentialsException ex) {
            redirectAttributes.addFlashAttribute("error", "Invalid admin credentials");
            return "redirect:/?tab=admin";
        }
    }

    @PostMapping("/add_vehicle")
    public String addVehicle(@RequestParam String name,
                             @RequestParam String model,
                             @RequestParam Integer capacity) {
        if (!SecurityUtils.hasRole(Role.ADMIN)) {
            return "redirect:/";
        }
        vehicleService.addVehicle(name, model, capacity);
        return "redirect:/";
    }

    @PostMapping("/add_driver")
    public String addDriver(@RequestParam String name,
                            @RequestParam Integer experience) {
        if (!SecurityUtils.hasRole(Role.ADMIN)) {
            return "redirect:/";
        }
        driverService.addDriver(name, experience);
        return "redirect:/";
    }

    @PostMapping("/delete_vehicle/{vehicle_id}")
    public String deleteVehicle(@PathVariable Long vehicle_id) {
        if (!SecurityUtils.hasRole(Role.ADMIN)) {
            return "redirect:/";
        }
        vehicleService.deleteVehicle(vehicle_id);
        return "redirect:/";
    }

    @PostMapping("/delete_driver/{driver_id}")
    public String deleteDriver(@PathVariable Long driver_id) {
        if (!SecurityUtils.hasRole(Role.ADMIN)) {
            return "redirect:/";
        }
        driverService.deleteDriver(driver_id);
        return "redirect:/";
    }

    @PostMapping("/cancel_trip/{trip_id}")
    public String cancelTrip(@PathVariable Long trip_id) {
        if (!SecurityUtils.hasRole(Role.ADMIN)) {
            return "redirect:/";
        }
        tripService.cancelTrip(trip_id);
        return "redirect:/";
    }

    @GetMapping("/logout")
    public String adminLogout(HttpServletRequest request) {
        request.getSession().removeAttribute("admin");
        return "redirect:/logout";
    }
}
