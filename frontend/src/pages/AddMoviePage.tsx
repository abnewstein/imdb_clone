import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddMovie from "@/components/AddMovie";

const AddMoviePage: React.FC = () => {
  return (
    <Card className="w-[450px] m-auto">
      <CardHeader>
        <CardTitle>Add a new Movie</CardTitle>
      </CardHeader>
      <CardContent>
        <AddMovie />
      </CardContent>
    </Card>
  );
};

export default AddMoviePage;
