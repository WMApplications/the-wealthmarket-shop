/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Services;

import com.Managers.ProductManager;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import wmengine.Managers.*;

/**
 *
 * @author Saint
 */
public class UserServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ClassNotFoundException, SQLException, ParseException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            String json = "";
            String type = request.getParameter("type").trim();
            String empty = "none";
            String result = "";
            String json1 = "";
            String json2 = "";
            String json3 = "";
            String json4 = "";
            HttpSession session = request.getSession(true);
            switch (type) {
                case "Login": {
                    String[] data = request.getParameterValues("data[]");
                    String Email_PhoneNumber = data[0].trim();
                    String Password = data[1].trim();
                    String UserStatus = "";
                    int UserID = 0;
                    if (GeneralUserManager.checkEmailAddressOrPhoneNumberExist(Email_PhoneNumber)) {
                        UserID = GeneralUserManager.checkPasswordEmailMatch(Password, Email_PhoneNumber);
                        if (UserID != 0) {
                            int blocked = GeneralUserManager.CheckUserBlockedStatus(UserID);
                            if (blocked == 0) {
                                UserStatus = GeneralUserManager.getUserStatus(UserID);
                                if (UserStatus.equals("Activated")) {
                                    GeneralUserManager.UpdateUserStatus(UserID, "Online");
                                    session.setAttribute("UserOnlineOrOffline", "Online");
                                    session.setAttribute("Id", UserID);
                                    String UserName = GeneralUserManager.getUserName(UserID);
                                    if (UserName.equals("null") || UserName.equals("none none") || UserName.equals("none")) {
                                        UserName = "Guest";
                                    }
                                    session.setAttribute("UserName", UserName);
                                    String UserEmail = GeneralUserManager.getUserEmail(UserID);
                                    session.setAttribute("UserEmail", UserEmail);
                                    result = "success";
                                    String cart = "" + session.getAttribute("cart");
                                    if (!cart.equals("") && !cart.equals("null")) {
                                        result = ProductManager.UpdateUserCartFromSession(UserID, cart);
                                        session.removeAttribute("cart");
                                        session.setAttribute("cart", "");
                                    }
                                    json = new Gson().toJson(result);
                                } else {
                                    result = "Account has not been activated";
                                    json = new Gson().toJson(result);
                                }
                            } else {
                                result = "Blocked";
                                json = new Gson().toJson(result);
                            }
                        } else {
                            result = "Incorrect Login Details";
                            json = new Gson().toJson(result);
                        }
                    } else {
                        result = "Email or Phone Number Entered Doesn't Exist";
                        json = new Gson().toJson(result);

                    }
                    break;
                }

                case "GetMemberDetails": {
                    String userid = request.getParameter("data");
                    int id = Integer.parseInt(userid);
                    HashMap<String, Object> memberdetails = GeneralUserManager.getUserDetails(id);
                    HashMap<Integer, HashMap<String, String>> memberAdddetails = GeneralUserManager.GetUserAddress(id);
                    json1 = new Gson().toJson(memberdetails);
                    json2 = new Gson().toJson(memberAdddetails);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }

                case "GetPickUpCentres": {
                    String pickupid = request.getParameter("data");
                    int PickUpID = Integer.parseInt(pickupid);
                    HashMap<String, String> centerdetails = GeneralUserManager.getPickUpCenterDetails(PickUpID);
                    json = new Gson().toJson(centerdetails);
                    break;
                }

                case "ResetNewPassword": {
                    String[] params = request.getParameterValues("data");
                    String[] data = null;
                    for (String param : params) {
                        data = param.split(",");
                    }
                    int UserID = Integer.parseInt(data[0]);
                    String userpass = data[1];
                    result = GeneralUserManager.UpdatePassword(UserID, userpass);
                    if (result.equals("success")) {
                        GeneralMessageManager.sendMemberMessage(1, "Password reset occurred on your account", "Password Reset", UserID);
//                         String bdy = "New Password: " + userpass;
//                        MessageManager.SendEmail(email, "Password Recovery Code", bdy);
//                        String UserPhoneNumber = DBManager.GetString(Tables.UserTable.PhoneNumber, Tables.UserTable.Table, "where" + Tables.UserTable.ID + " = " + MemberUserID);
//                        SmsManager.SendSMS(regCode, UserPhoneNumber);
                        String email = GeneralUserManager.GetMemberEmail(UserID);
                        String password = GeneralUserManager.GetMemberPassword(UserID);
                        json1 = new Gson().toJson(result);
                        json2 = new Gson().toJson(email);
                        json3 = new Gson().toJson(password);
                        json = "[" + json1 + "," + json2 + "," + json3 + "]";
                    } else {
                        json1 = new Gson().toJson("failed");
                        json = "[" + json1 + "]";
                    }
                    break;
                }

                case "UpdateUserDetails": {
                    String[] params = request.getParameterValues("data");
                    String[] data = null;
                    for (String param : params) {
                        data = param.split(",");
                    }
                    int UserID = Integer.parseInt(data[0]);
                    String NewValue = data[1];
                    String action = data[2];
                    if (action.equals("Email")) {
                        result = GeneralUserManager.UpdateEmail(UserID, NewValue);
                    } else if (action.equals("Password")) {
                        result = GeneralUserManager.UpdatePassword(UserID, NewValue);
                    }
                    json = new Gson().toJson(result);
                    break;
                }
                case "Populate": {
                    String[] data = request.getParameterValues("data[]");
                    int val = Integer.parseInt(data[0]);
                    String Section = data[1];
                    String value = data[2];
                    HashMap<Integer, String> nameset = GeneralUserManager.GetTableOptions(val, Section);
                    HashMap<String, HashMap<Integer, String>> resend = new HashMap<>();
                    resend.put(value, nameset);
                    json = new Gson().toJson(resend);
                    break;
                }
                case "GetValues": {
                    String[] data = request.getParameterValues("data[]");
                    int val = Integer.parseInt(data[0]);
                    String section = data[1];
                    String Case = data[2];
                    int value = GeneralUserManager.GetValue(Case, section, val);
                    json = new Gson().toJson(value);
                    break;
                }
                case "InsertSection": {
                    int value;
                    String[] data = request.getParameterValues("data[]");
                    String Section = data[0];
                    String AdditionName = data[1];
                    String[] resend = new String[3];
                    value = GeneralUserManager.InsertNewSection(AdditionName, Section, data);
                    resend[0] = Section;
                    resend[1] = AdditionName;
                    resend[2] = "" + value;
                    json = new Gson().toJson(resend);
                }
            }

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(UserServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(UserServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParseException ex) {
            Logger.getLogger(UserServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(UserServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(UserServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParseException ex) {
            Logger.getLogger(UserServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
