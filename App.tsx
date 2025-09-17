import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, User, Bell, CreditCard, BarChart3, Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from './utils/supabase/info';

import { ItineraryGenerator } from './components/itinerary-generator';
import { MapExplorer } from './components/map-explorer';
import { BookingManager } from './components/booking-manager';
import { UserProfile } from './components/user-profile';
import { NotificationCenter } from './components/notification-center';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { PaymentInterface } from './components/payment-interface';

function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize app and check for existing user session
    initializeApp();
  }, []);

  useEffect(() => {
    // Load notifications when user changes
    loadNotifications();
  }, [user]);

  const initializeApp = async () => {
    try {
      // Load sample notifications for demo
      loadNotifications();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      if (user) {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04578462/api/notifications?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        if (response.ok) {
          const notificationData = await response.json();
          setNotifications(notificationData);
        }
      } else {
        // Sample notifications for demo
        setNotifications([
          {
            id: '1',
            type: 'booking',
            title: 'Flight Booking Confirmed',
            message: 'Your flight from NYC to Paris has been confirmed.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleSignIn = (userData) => {
    setUser(userData);
    toast.success('Welcome to TravelAI!');
    // Reload notifications after sign in
    setTimeout(() => {
      loadNotifications();
    }, 500);
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveTab('itinerary');
    setNotifications([]);
    toast.success('Signed out successfully');
  };

  const TabNavigation = () => (
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
      <TabsTrigger value="itinerary" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Itinerary</span>
      </TabsTrigger>
      <TabsTrigger value="explore" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Explore</span>
      </TabsTrigger>
      <TabsTrigger value="booking" className="flex items-center gap-2">
        <Plane className="h-4 w-4" />
        <span className="hidden sm:inline">Booking</span>
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="hidden lg:flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
        {notifications.filter(n => !n.read).length > 0 && (
          <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
            {notifications.filter(n => !n.read).length}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="payment" className="hidden lg:flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        Payment
      </TabsTrigger>
      <TabsTrigger value="analytics" className="hidden lg:flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Analytics
      </TabsTrigger>
    </TabsList>
  );

  const MobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            TravelAI
          </SheetTitle>
          <SheetDescription>
            AI-powered travel planning and booking
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            onClick={() => {
              setActiveTab('notifications');
              setMobileMenuOpen(false);
            }}
            className="justify-start"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'payment' ? 'default' : 'ghost'}
            onClick={() => {
              setActiveTab('payment');
              setMobileMenuOpen(false);
            }}
            className="justify-start"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Payment
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => {
              setActiveTab('analytics');
              setMobileMenuOpen(false);
            }}
            className="justify-start"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">TravelAI</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Powered by Gemini AI
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <MobileMenu />
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Welcome, {user.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button size="sm">Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabNavigation />

          <TabsContent value="itinerary" className="space-y-6">
            <ItineraryGenerator user={user} onSignIn={handleSignIn} />
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            <MapExplorer user={user} />
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <BookingManager user={user} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <UserProfile user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationCenter 
              notifications={notifications} 
              onNotificationUpdate={setNotifications}
              user={user}
            />
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <PaymentInterface user={user} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard user={user} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 TravelAI - Powered by Gemini AI, Google Maps, and advanced analytics</p>
            <p className="mt-1">Prototype built with Figma Make - Not for production use</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;