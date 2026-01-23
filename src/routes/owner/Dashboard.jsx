import { useState } from "react";
import { useTransactions } from "../../contexts/TransactionsContext";
import { Box, Button } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReportDialog from "../../components/shared/ReportDialog";

export default function Dashboard() {
  const { getUniqueCustomers, getAllTimeRevenue } = useTransactions();

  const customers = getUniqueCustomers();
  const revenueData = getAllTimeRevenue();

  const [openXReport, setOpenXReport] = useState(false);

  return (
    <Box>
      <Button variant="outlined" startIcon={<AssessmentIcon />} onClick={() => setOpenXReport(true)}>
        عرض تقرير X
      </Button>

      <ReportDialog open={openXReport} onClose={() => setOpenXReport(false)} type={"X"} />
    </Box>
  );
}
