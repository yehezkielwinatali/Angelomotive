"use client";
import {
  getDealershipInfo,
  getUsers,
  saveWorkingHours,
  updateUserRole,
} from "@/actions/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetch from "@/hooks/use-fetch";
import { Clock, Shield } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const SettingsForm = () => {
  const [workingHours, setWorkingHours] = React.useState(
    DAYS.map((day) => ({
      dayOfWeek: day.value,
      openTime: "09:00",
      closeTime: "18:00",
      isOpen: true,
    }))
  );
  const [userSearch, setUserSearch] = React.useState("");
  const [confirmAdminDialogOpen, setConfirmAdminDialogOpen] =
    React.useState(false);
  const [userToPromote, setUserToPromote] = React.useState<{
    id: string;
  } | null>(null);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = React.useState(false);
  const [userToDemote, setUserToDemote] = React.useState<{ id: string } | null>(
    null
  );

  const {
    isLoading: fetchingSettings,
    fn: fetchDealershipInfo,
    error: settingsError,
    data: settingsData,
  } = useFetch(getDealershipInfo);

  const {
    isLoading: savingsHours,
    fn: saveHours,
    error: saveError,
    data: saveResult,
  } = useFetch(saveWorkingHours);

  const {
    isLoading: fetchingUsers,
    fn: fetchUsers,
    error: usersError,
    data: usersData,
  } = useFetch(getUsers);

  const {
    isLoading: updatingUserRole,
    fn: updateRole,
    error: updateError,
    data: updateResult,
  } = useFetch(updateUserRole);

  useEffect(() => {
    fetchDealershipInfo();
    fetchUsers();
  }, []);

  interface dayOfWeek {
    dayOfWeek:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
  }

  useEffect(() => {
    if (settingsData?.success && settingsData.data) {
      const dealership = settingsData.data;
      if (dealership.workingHours.length > 0) {
        const mappedHours = DAYS.map((day) => {
          const hourData = dealership.workingHours.find(
            (h: dayOfWeek) => h.dayOfWeek === day.value
          );
          if (hourData) {
            return {
              dayOfWeek: hourData.dayOfWeek,
              openTime: hourData.openTime,
              closeTime: hourData.closeTime,
              isOpen: hourData.isOpen,
            };
          }
          return {
            dayOfWeek: day.value,
            openTime: "09:00",
            closeTime: "18:00",
            isOpen: day.value !== "SUNDAY",
          };
        });
        setWorkingHours(mappedHours);
      }
    }
  }, [settingsData]);

  useEffect(() => {
    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
    }
    if (usersError) {
      console.error("Error fetching users:", usersError);
    }
    if (saveError) {
      console.error("Error saving working hours:", saveError);
    }
    if (updateError) {
      console.error("Error updating user role:", updateError);
    }
  }, [settingsError, usersError, saveError, updateError]);

  useEffect(() => {
    if (saveResult?.success) {
      toast.success("Working hours saved successfully");
      fetchDealershipInfo();
    }
    if (updateResult?.success) {
      toast.success("User role updated successfully");
      fetchUsers();
      setConfirmAdminDialogOpen(false);
      setConfirmRemoveDialog(false);
    }
  }, [saveResult, updateResult]);

  const handleWorkingHourChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedHours = [...workingHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    };
    setWorkingHours(updatedHours);
  };

  const handleSaveHours = async () => {
    await saveHours(workingHours);
  };

  const handleMakeAdmin = async () => {
    if (!userToPromote) return;
    await updateRole(userToPromote.id, "ADMIN");
  };

  const handleRemoveAdmin = async () => {
    if (!userToDemote) return;
    await updateRole(userToDemote.id, "USER");
  };
  const filteredUsers = usersData?.success
    ? usersData.data.filter(
        (user: any) =>
          user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.name?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hours">
        <TabsList>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="h-4 w-4 mr-2" />
            Admin Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                {" "}
                Set your dealership's working hours for each day of the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS.map((day, index) => (
                  <div
                    key={day.value}
                    className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50"
                  >
                    <div className="col-span-3 font-medium">{day.label}</div>
                    <div className="col-span-9 md:col-span-2 flex items-center">
                      <Checkbox
                        id={`is-open-${day.value}`}
                        checked={workingHours[index]?.isOpen}
                        onCheckedChange={(checked: boolean) => {
                          handleWorkingHourChange(index, "isOpen", checked);
                        }}
                      />
                      <Label
                        htmlFor={`is-open-${day.value}`}
                        className="ml-2 cursor-pointer"
                      >
                        {workingHours[index]?.isOpen ? "Open" : "Closed"}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
