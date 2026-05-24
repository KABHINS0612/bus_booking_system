package com.busbookingsystem.service;

import com.busbookingsystem.entity.Trip;
import com.busbookingsystem.entity.User;
import com.busbookingsystem.entity.Vehicle;
import com.busbookingsystem.entity.Driver;
import com.busbookingsystem.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public List<Trip> getTripsByUserId(Long userId) {
        return tripRepository.findByUser_Id(userId);
    }

    public Optional<Trip> getTripById(Long tripId) {
        return tripRepository.findById(tripId);
    }

    public Trip bookTrip(User user, Vehicle vehicle, Driver driver, String startDate, 
                        String endDate, String pickupPoint, String endPoint) {
        Trip trip = new Trip();
        trip.setUser(user);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStartDate(startDate);
        trip.setEndDate(endDate);
        trip.setPickupPoint(pickupPoint);
        trip.setEndPoint(endPoint);
        trip.setStatus("booked");
        return tripRepository.save(trip);
    }

    public Trip cancelTrip(Long tripId) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            Trip t = trip.get();
            t.setStatus("cancelled");
            return tripRepository.save(t);
        }
        return null;
    }

    public boolean userCanCancelTrip(Long userId, Long tripId) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            return trip.get().getUser() != null && trip.get().getUser().getId().equals(userId);
        }
        return false;
    }
}

