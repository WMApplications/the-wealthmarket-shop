/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Models;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import wmengine.Managers.GeneralUserManager;

/**
 *
 * @author Saint
 */
@WebServlet(name = "LinksServlet", urlPatterns = {"/LinksServlet"})
public class LinksServlet extends HttpServlet {

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
            throws ServletException, IOException, ClassNotFoundException, SQLException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            HttpSession session = request.getSession(true);
            String type = request.getParameter("type");
            switch (type) {
                case "Login": {
                    response.sendRedirect("pages/general/login.jsp");
                    break;
                }
                case "Offline": {
                    response.sendRedirect("pages/general/offline.jsp");
                    break;
                }
                case "Cart": {
                    response.sendRedirect("pages/shop/cart/cart.jsp");
                    break;
                }
                case "Search": {
                    session.setAttribute("categoryID", request.getParameter("cat"));
                    session.setAttribute("query", request.getParameter("query"));
                    response.sendRedirect("pages/shop/products/products.jsp");
                    break;
                }
                case "ProductDetails": {
                    session.setAttribute("productid", request.getParameter("productid"));
                    response.sendRedirect("pages/shop/products/product_details.jsp");
                    break;
                }
                case "ProductReview": {
                    session.setAttribute("productid", request.getParameter("productid"));
                    response.sendRedirect("pages/shop/products/product_review.jsp");
                    break;
                }
                case "Services": {
                    response.sendRedirect("pages/shop/services/services.jsp");
                    break;
                }
                case "CheckOut": {
                    response.sendRedirect("pages/shop/checkout/checkout.jsp");
                    break;
                }
                case "AllCategories": {
                    response.sendRedirect("pages/shop/categories/categories.jsp");
                    break;
                }
                case "WishList": {
                    response.sendRedirect("pages/users/wishlist/wishlist.jsp");
                    break;
                }
                case "Orders": {
                    response.sendRedirect("pages/users/order/order.jsp");
                    break;
                }
                case "Order_Status": {
                    response.sendRedirect("pages/shop/order_status/order_status.jsp");
                    break;
                }
                case "Profile": {
                    response.sendRedirect("pages/users/profile/profile.jsp");
                    break;
                }
                case "Deals": {
                    response.sendRedirect("pages/shop/deals/deals.jsp");
                    break;
                }
                case "Complains": {
                    response.sendRedirect("pages/shop/complain/complain.jsp");
                    break;
                }
                case "Home": {
                    int UserID =  Integer.parseInt("" + session.getAttribute("Id"));
                    GeneralUserManager.UpdateUserStatus(UserID, "Offline");
                    session.setAttribute("UserOnlineOrOffline", "");
                    GeneralUserManager.UpdateUserTime(UserID);
                    session.removeAttribute("Id");
                    response.sendRedirect("index.jsp");
                    break;
                }
                case "Index": {
                    response.sendRedirect("index.jsp");
                    break;
                }
                 default: {
                    response.sendRedirect(request.getHeader("referer"));
                }
            }
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
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
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
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
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
