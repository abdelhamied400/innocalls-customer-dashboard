import api from "./api";

export type Ticket = {
  id: string;
  subject: string;
  ticketNumber: string;
  createdTime: string;
  status: string;
  departmentName: string;
};

export type TicketDetail = {
  id: string;
  ticketNumber: string;
  subject: string;
  createdTime: string;
  department: string;
  status: string;
  priority: string;
  classification: string;
  channel: string;
  description: string;
  assignee: string;
  dueDate: string;
  attachmentCount: string;
  replyUrl: string;
  replies: TicketReply[];
};

export type TicketReply = {
  summary: string;
  channel: string;
  createdTime: string;
  attachmentCount: string;
  direction: "in" | "out";
  authorType: "END_USER" | "AGENT";
  authorName: string;
};

export type Department = {
  id: string;
  name: string;
};

export type TicketFilters = {
  page?: number;
  perPage?: number;
  departmentId?: string;
  subject?: string;
  status?: string;
};

export type TicketsResponse = {
  data: Ticket[];
  last_page: number;
};

export default {
  getTickets: async (filters: TicketFilters = {}): Promise<TicketsResponse> => {
    const res = await api.get("/zoho/customer-tickets", {
      params: {
        page: filters.page || 1,
        perPage: filters.perPage || 10,
        ...(filters.departmentId && { departmentId: filters.departmentId }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.status && { status: filters.status }),
      },
    });
    return res.data;
  },

  getTicketById: async (ticketId: string): Promise<TicketDetail> => {
    const res = await api.get(`/zoho/tickets/${ticketId}`);
    return res.data;
  },

  getDepartments: async (): Promise<Department[]> => {
    const res = await api.get("/zoho/departments");
    return res.data;
  },

  createTicket: async (data: {
    subject: string;
    departmentId: string;
    phone: string;
    description: string;
    priority?: string;
    classification?: string;
    file?: File;
  }) => {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("departmentId", data.departmentId);
    formData.append("phone", data.phone);
    formData.append("description", data.description);
    if (data.priority) {
      formData.append("priority", data.priority);
    }
    if (data.classification) {
      formData.append("classification", data.classification);
    }
    if (data.file) {
      formData.append("attachment", data.file);
    }
    const res = await api.post("/zoho/create-ticket", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
