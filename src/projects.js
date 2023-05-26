import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { Permissions } from "@tenancy.tly/policies";
import { tenancy } from "./tenancy-client.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * Retrieve the projects in the organization
 * 
 * @param {string} organizationId The organization ID
 * @returns {Promise<object>} The projects in the organization
 */
router.get("/:organizationId/projects", async (req, res) => {
  /**
   * Define the permissions required to create a project
   */
  const permissions = [Permissions.read("projects")];

  try {
    const { organizationId } = req.params;

    /**
     * Check if the user is allowed to create a project in the organization
     */
    const isAllowed = await tenancy.Permissions.isAllowed({
      organizationId,
      permissions,
    });

    if (!isAllowed) return res.status(403).json({ message: "Access denied" });

    /**
     * Ahoy! The user is allowed to retrieve the projects in the organization
     */
    const projects = await prisma.project.findMany({
      where: { organizationId },
    });

    res.json({ projects });
  } catch (error) {
    res.json({ message: error.message });
  }
});

/**
 * Create a project in the organization
 * 
 * @param {string} organizationId The organization ID
 * @param {object} body The project data
 * @returns {Promise<object>} The created project
 */
router.post("/:organizationId/projects", async (req, res) => {
  /**
   * Define the permissions required to create a project
   */
  const permissions = [Permissions.write("projects")];

  try {
    const { organizationId } = req.params;

    /**
     * Check if the user is allowed to create a project in the organization
     */
    const isAllowed = await tenancy.Permissions.isAllowed({
      organizationId,
      permissions,
    });

    if (!isAllowed) return res.status(403).json({ message: "Access denied" });

    /**
     * Ahoy! The user is allowed to create a project in the organization
     */
    const project = await prisma.project.create({
      data: { ...req.body, organizationId },
    });

    res.json({ project });
  } catch (error) {
    res.json({ message: error.message });
  }
});

export default router;
