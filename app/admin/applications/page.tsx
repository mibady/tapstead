"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getProviderApplications, updateApplicationStatus } from "@/lib/actions/provider-actions"
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, User, Phone, Mail, Shield } from "lucide-react"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApp, setSelectedApp] = useState(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [statusFilter])

  const fetchApplications = async () => {
    setLoading(true)
    const result = await getProviderApplications(statusFilter === "all" ? undefined : statusFilter)
    if (result.success) {
      setApplications(result.applications)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    setUpdating(true)
    const result = await updateApplicationStatus(applicationId, status, reviewNotes)
    if (result.success) {
      await fetchApplications()
      setSelectedApp(null)
      setReviewNotes("")
    }
    setUpdating(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredApplications = applications.filter(
    (app) =>
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Applications</h1>
            <p className="text-gray-600">Review and manage provider applications</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No provider applications have been submitted yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {application.first_name} {application.last_name}
                        </h3>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        {application.military_veteran && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Veteran
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{application.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{application.phone}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Experience:</span> {application.years_experience}
                        </div>
                        <div>
                          <span className="font-medium">Services:</span> {application.selected_services?.length || 0}{" "}
                          selected
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span>{" "}
                          {new Date(application.application_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApp(application)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Application Review - {application.first_name} {application.last_name}
                            </DialogTitle>
                            <DialogDescription>Review all application details and make a decision</DialogDescription>
                          </DialogHeader>

                          {selectedApp && (
                            <div className="space-y-6">
                              {/* Personal Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="font-medium">Name</Label>
                                    <p>
                                      {selectedApp.first_name} {selectedApp.last_name}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Email</Label>
                                    <p>{selectedApp.email}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Phone</Label>
                                    <p>{selectedApp.phone}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Business Name</Label>
                                    <p>{selectedApp.business_name || "N/A"}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label className="font-medium">Address</Label>
                                    <p>
                                      {selectedApp.address}, {selectedApp.city}, {selectedApp.state}{" "}
                                      {selectedApp.zip_code}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Experience */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Professional Experience</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label className="font-medium">Years of Experience</Label>
                                    <p>{selectedApp.years_experience}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Previous Work</Label>
                                    <p className="whitespace-pre-wrap">{selectedApp.previous_work}</p>
                                  </div>
                                  {selectedApp.specializations && (
                                    <div>
                                      <Label className="font-medium">Specializations</Label>
                                      <p className="whitespace-pre-wrap">{selectedApp.specializations}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Verification */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Verification Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-medium">Insurance</Label>
                                      <p>
                                        {selectedApp.has_insurance ? `Yes - ${selectedApp.insurance_amount}` : "No"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">License</Label>
                                      <p>
                                        {selectedApp.has_license
                                          ? `${selectedApp.license_number} (${selectedApp.license_state})`
                                          : "No"}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="font-medium">References</Label>
                                    <div className="space-y-2 mt-2">
                                      {selectedApp.provider_references?.map((ref, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                          <p className="font-medium">{ref.name}</p>
                                          <p className="text-sm text-gray-600">
                                            {ref.phone} - {ref.relationship}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Services */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Services & Availability</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label className="font-medium">Selected Services</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {selectedApp.selected_services?.map((service) => (
                                        <Badge key={service} variant="secondary">
                                          {service}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="font-medium">Availability</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {Object.entries(selectedApp.availability || {}).map(
                                        ([day, available]) =>
                                          available && (
                                            <Badge key={day} variant="outline" className="capitalize">
                                              {day}
                                            </Badge>
                                          ),
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Review Actions */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Review Decision</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label htmlFor="reviewNotes">Review Notes</Label>
                                    <Textarea
                                      id="reviewNotes"
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      placeholder="Add notes about your decision..."
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex space-x-4">
                                    <Button
                                      onClick={() => handleStatusUpdate(selectedApp.id, "approved")}
                                      disabled={updating}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleStatusUpdate(selectedApp.id, "rejected")}
                                      disabled={updating}
                                      variant="destructive"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => handleStatusUpdate(selectedApp.id, "under_review")}
                                      disabled={updating}
                                      variant="outline"
                                    >
                                      <Clock className="w-4 h-4 mr-2" />
                                      Under Review
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
