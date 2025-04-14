import React, { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, FileText, Mail, MapPin, Phone, Edit } from 'lucide-react';
import Doctorsidebar from '../../components/ui/Doctorsidebar';
import Doctornavbar from '../../components/ui/Doctornavbar';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';

const ProfileView = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
          headers: {
            dtoken: dToken
          }
        });
        setDoctorProfile(response.data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    };

    fetchDoctorProfile();
  }, [backendUrl, dToken]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Doctorsidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Doctornavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600">View and manage your professional information</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardContent>
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={doctorProfile?.image || "/placeholder.svg"} alt={doctorProfile?.name} />
                      <AvatarFallback className="bg-medical-primary text-white text-xl">
                        {doctorProfile?.name?.[0] || 'D'}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{doctorProfile?.name || 'Loading...'}</h2>
                    <p className="text-medical-primary font-medium">{doctorProfile?.speciality}</p>
                    
                    {doctorProfile?.certification && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Certification</p>
                        <img 
                          src={doctorProfile.certification} 
                          alt="Doctor Certification"
                          className="max-w-full h-auto rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{doctorProfile?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{doctorProfile?.address?.line1}, {doctorProfile?.address?.line2}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <CalendarClock className="h-8 w-8 text-medical-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Today's Appointments</p>
                      <p className="text-2xl font-bold">{doctorProfile?.todayAppointmentsCount || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <FileText className="h-8 w-8 text-medical-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Patients</p>
                      <p className="text-2xl font-bold">{doctorProfile?.totalPatients || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-medical-primary text-white flex items-center justify-center mr-3 font-bold">
                      {doctorProfile?.averageRating || '0'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(doctorProfile?.averageRating || 0))}
                        {doctorProfile?.averageRating % 1 !== 0 && '☆'}
                        {'☆'.repeat(5 - Math.ceil(doctorProfile?.averageRating || 0))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctorProfile?.recentFeedbacks?.map((feedback, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{feedback.patient}</p>
                            <p className="text-sm text-gray-600">{feedback.comment}</p>
                          </div>
                          <div className="flex text-yellow-400">
                            {'★'.repeat(feedback.rating)}
                            {'☆'.repeat(5 - feedback.rating)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileView