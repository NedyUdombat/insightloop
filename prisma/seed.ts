import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("Seeding database...");

  const result = await prisma.$transaction(async (tx) => {
    // 1. Seed User
    const argon2 = await import("argon2");
    const password = await argon2.hash("SlowMotion48.", {
      parallelism: 1,
    });
    const user = await tx.user.upsert({
      where: { email: "nedyudombat@gmail.com" },
      update: {},
      create: {
        email: "nedyudombat@gmail.com",
        firstname: "Nedy",
        lastname: "Udombat",
        emailVerified: true,
        emailVerifiedAt: new Date(),
        password,
      },
    });
    console.log("User seeded:", user);

    // 2. Seed Project
    const project = await tx.project.create({
      data: {
        name: "E-Commerce Platform",
        ownerId: user.id,
        defaultEnvironment: "DEVELOPMENT",
        emailNotifications: true,
        eventAlerts: true,
        weeklyReports: true,
        autoArchive: false,
        retentionDays: 90,
      },
    });
    console.log("Project seeded:", project);

    // 3. Seed Ingestion API Key for Development
    const crypto = await import("crypto");
    const apiKeyValue = `il_dev_${crypto.randomBytes(32).toString("hex")}`;
    const apiKeyHash = crypto
      .createHash("sha256")
      .update(apiKeyValue)
      .digest("hex");
    const apiKeyHint = apiKeyValue.slice(-8);

    const apiKey = await tx.apiKey.create({
      data: {
        name: "Development API Key",
        keyValue: apiKeyValue,
        keyHash: apiKeyHash,
        keyHint: apiKeyHint,
        type: "INGESTION",
        environment: "DEVELOPMENT",
        projectId: project.id,
        createdById: user.id,
      },
    });
    console.log("API Key seeded:", apiKey);

    // 4. Seed End Users (4 known + 2 anonymous)
    const endUsers = await Promise.all([
      tx.endUser.create({
        data: {
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          externalUserId: "user_001",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          name: "Michael Chen",
          email: "michael.chen@example.com",
          externalUserId: "user_002",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          name: "Emily Rodriguez",
          email: "emily.rodriguez@example.com",
          externalUserId: "user_003",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          name: "David Kim",
          email: "david.kim@example.com",
          externalUserId: "user_004",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          name: "Anonymous User",
          email: "anon_1@anonymous.local",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          name: "Anonymous User",
          email: "anon_2@anonymous.local",
          projectId: project.id,
        },
      }),
    ]);
    console.log(`Seeded ${endUsers.length} end users`);

    // 5. Seed 70 Events across all 6 end users and 3 environments
    const baseTime = Date.now();
    const events = [];

    // Helper function to create realistic event flows
    const createUserFlow = async (
      endUser: typeof endUsers[0],
      userIndex: number,
      startOffset: number
    ) => {
      const flows = [
        // Development events (40% of total)
        {
          env: "DEVELOPMENT",
          flow: [
            {
              name: "page_viewed",
              offset: 0,
              props: {
                page: "homepage",
                referrer: "https://google.com",
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "signup_started",
              offset: 2000,
              props: { source: "homepage_cta", session_id: `sess_dev_${userIndex}_1` },
            },
            {
              name: "signup_completed",
              offset: 45000,
              props: {
                method: "email",
                plan: "free",
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "profile_updated",
              offset: 120000,
              props: {
                fields_updated: ["avatar", "bio"],
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "browse_products",
              offset: 180000,
              props: {
                category: "electronics",
                filters_applied: { price_max: 500, brand: "TechCo" },
                session_id: `sess_dev_${userIndex}_2`,
              },
            },
            {
              name: "product_viewed",
              offset: 195000,
              props: {
                product_id: "prod_12345",
                product_name: "Wireless Headphones",
                price: 149.99,
                session_id: `sess_dev_${userIndex}_2`,
              },
            },
            {
              name: "add_to_cart",
              offset: 210000,
              props: {
                product_id: "prod_12345",
                quantity: 1,
                cart_value: 149.99,
                session_id: `sess_dev_${userIndex}_2`,
              },
            },
          ],
        },
        // Production events (35% of total)
        {
          env: "PRODUCTION",
          flow: [
            {
              name: "login_attempted",
              offset: 300000,
              props: { method: "email", session_id: `sess_prod_${userIndex}_1` },
            },
            {
              name: "login_succeeded",
              offset: 302000,
              props: {
                method: "email",
                remember_me: true,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "dashboard_viewed",
              offset: 305000,
              props: { widgets_loaded: 5, session_id: `sess_prod_${userIndex}_1` },
            },
            {
              name: "checkout_started",
              offset: 360000,
              props: {
                cart_items: 1,
                cart_value: 149.99,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "payment_info_entered",
              offset: 420000,
              props: {
                payment_method: "credit_card",
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "order_completed",
              offset: 450000,
              props: {
                order_id: `ord_${userIndex}_${Date.now()}`,
                total: 149.99,
                items_count: 1,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
          ],
        },
        // Staging events (25% of total)
        {
          env: "STAGING",
          flow: [
            {
              name: "feature_flag_evaluated",
              offset: 500000,
              props: {
                flag_name: "new_checkout_flow",
                value: true,
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
            {
              name: "wishlist_created",
              offset: 520000,
              props: {
                wishlist_name: "Holiday Shopping",
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
            {
              name: "product_added_to_wishlist",
              offset: 540000,
              props: {
                product_id: "prod_67890",
                wishlist_id: "wl_001",
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
            {
              name: "review_submitted",
              offset: 600000,
              props: {
                product_id: "prod_12345",
                rating: 5,
                review_length: 250,
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
          ],
        },
      ];

      for (const { env, flow } of flows) {
        for (const event of flow) {
          events.push({
            eventName: event.name,
            eventTimestamp: new Date(baseTime - startOffset + event.offset),
            projectId: project.id,
            endUserId: endUser.id,
            environment: env,
            properties: event.props,
            metadata: {
              browser: ["Chrome", "Firefox", "Safari", "Edge"][userIndex % 4],
              browser_version: "120.0.0",
              os: ["MacOS", "Windows", "Linux", "Android"][userIndex % 4],
              device_type: ["Desktop", "Mobile", "Tablet"][userIndex % 3],
              current_url: `https://shop.naijamall.ng/${event.name}`,
              host: "shop.naijamall.ng",
              pathname: `/${event.name}`,
              geoip_country_name: [
                "Nigeria",
                "Kenya",
                "South Africa",
                "Ghana",
                "Egypt",
                "Ethiopia",
              ][userIndex % 6],
              geoip_city_name: [
                "Lagos",
                "Nairobi",
                "Johannesburg",
                "Accra",
                "Cairo",
                "Addis Ababa",
              ][userIndex % 6],
              lib: "insightloop-browser",
              lib_version: "1.102.1",
              ip: `105.112.${userIndex}.${Math.floor(Math.random() * 255)}`,
              user_agent: `Mozilla/5.0 (compatible; InsightLoop/1.0)`,
            },
          });
        }
      }
    };

    // Create flows for each user with different time offsets
    for (let i = 0; i < endUsers.length; i++) {
      await createUserFlow(endUsers[i], i, i * 86400000); // Offset by days
    }

    // Create additional events to reach 70 total
    const additionalEventsNeeded = 70 - events.length;
    for (let i = 0; i < additionalEventsNeeded; i++) {
      const userIndex = i % endUsers.length;
      const envs = [
        "DEVELOPMENT",
        "DEVELOPMENT",
        "PRODUCTION",
        "PRODUCTION",
        "STAGING",
      ];
      events.push({
        eventName: [
          "search_performed",
          "filter_applied",
          "notification_clicked",
          "settings_updated",
          "share_clicked",
        ][i % 5],
        eventTimestamp: new Date(baseTime - i * 3600000),
        projectId: project.id,
        endUserId: endUsers[userIndex].id,
        environment: envs[i % 5],
        properties: {
          search_query: "wireless headphones",
          results_count: 42,
          session_id: `sess_extra_${userIndex}_${i}`,
        },
        metadata: {
          browser: "Chrome",
          browser_version: "120.0.0",
          os: "Windows",
          device_type: "Desktop",
          current_url: "https://shop.naijamall.ng/search",
          host: "shop.naijamall.ng",
          pathname: "/search",
          geoip_country_name: "Nigeria",
          geoip_city_name: "Abuja",
          lib: "insightloop-browser",
          lib_version: "1.102.1",
        },
      });
    }

    const createdEvents = await tx.event.createMany({
      data: events,
    });
    console.log(`Seeded ${createdEvents.count} events`);

    // 6. Seed 15 Feedback items
    const feedbacks = [];
    const statuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
    const ratings = [1, 2, 3, 4, 5];
    const feedbackUsers = [endUsers[0], endUsers[1], endUsers[2], endUsers[4]]; // 3 known + 1 anon

    const feedbackTemplates = [
      {
        title: "Checkout flow is confusing",
        message:
          "The checkout button is frozen if I add items to the cart. I have to refresh the page to complete my purchase.",
        additionalInfo:
          "This happens on both Chrome and Safari. Cart total shows incorrect amount.",
        rating: 2,
      },
      {
        title: "Love the new wishlist feature!",
        message:
          "The wishlist feature provides a smooth experience. Very intuitive and easy to use.",
        additionalInfo: "Would be great to share wishlists with friends.",
        rating: 5,
      },
      {
        title: null,
        message:
          "Sign in functionality doesn't work properly. Gets stuck on loading screen.",
        additionalInfo: null,
        rating: 1,
      },
      {
        title: "Product search is amazing",
        message:
          "Search results are relevant and load quickly. Filters work perfectly!",
        additionalInfo: null,
        rating: 5,
      },
      {
        title: "Mobile app crashes",
        message:
          "App crashes when I try to upload profile picture. Happens every time on iOS.",
        additionalInfo: "iPhone 13 Pro, iOS 17.2",
        rating: 1,
      },
      {
        title: null,
        message: "Notification settings are hard to find",
        additionalInfo: null,
        rating: 3,
      },
      {
        title: "Great customer support",
        message:
          "Support team was very helpful and resolved my issue within 24 hours.",
        additionalInfo: "Ticket #12345",
        rating: 5,
      },
      {
        title: "Payment processing is slow",
        message:
          "Takes over 30 seconds to process payment. Other sites are much faster.",
        additionalInfo: "Using Visa card",
        rating: 2,
      },
      {
        title: null,
        message: "Dashboard loads slowly on mobile",
        additionalInfo: null,
        rating: 3,
      },
      {
        title: "Product images don't load",
        message:
          "Images fail to load on product detail pages. Just see blank placeholders.",
        additionalInfo: "Happening on staging environment",
        rating: 2,
      },
      {
        title: "Excellent user experience",
        message:
          "The entire shopping experience from browse to checkout is seamless. Well designed!",
        additionalInfo: "Particularly like the one-click checkout option",
        rating: 5,
      },
      {
        title: "Filter options are limited",
        message: "Need more filter options for product search, especially price ranges.",
        additionalInfo: null,
        rating: 3,
      },
      {
        title: null,
        message: "Order history is incomplete",
        additionalInfo: null,
        rating: 2,
      },
      {
        title: "Wishlist sync works great",
        message:
          "Love that my wishlist syncs across all devices. No issues so far!",
        additionalInfo: "Using both web and mobile app",
        rating: 4,
      },
      {
        title: "Dark mode is broken",
        message:
          "Dark mode makes some text unreadable. White text on white background in several places.",
        additionalInfo: "Screenshots attached (not really, but would be)",
        rating: 2,
      },
    ];

    for (let i = 0; i < 15; i++) {
      const template = feedbackTemplates[i];
      const userIndex = i % feedbackUsers.length;
      const shouldOmitFields = Math.random() < 0.125; // 10-15% chance

      // Time variations
      let timeOffset;
      if (i % 3 === 0) {
        timeOffset = i * 86400000; // Days apart
      } else if (i % 3 === 1) {
        timeOffset = i * 3600000; // Hours apart
      } else {
        timeOffset = i * 60000; // Minutes apart
      }

      feedbacks.push({
        title: shouldOmitFields ? null : template.title,
        message: template.message,
        additionalInfo: shouldOmitFields ? null : template.additionalInfo,
        rating: ratings[i % 5],
        status: statuses[i % 4],
        feedbackTimestamp: new Date(baseTime - timeOffset),
        projectId: project.id,
        endUserId: feedbackUsers[userIndex].id,
        environment: ["DEVELOPMENT", "PRODUCTION", "STAGING"][i % 3],
        properties: {
          page: ["checkout", "product_detail", "dashboard", "search"][i % 4],
          component: [
            "checkout_button",
            "wishlist_icon",
            "login_form",
            "search_bar",
          ][i % 4],
          version: "2.1.0",
        },
        metadata: {
          browser: ["Chrome", "Safari", "Firefox", "Edge"][i % 4],
          browser_version: ["120.0.0", "17.2", "119.0", "120.0.1"][i % 4],
          os: ["Windows", "Android", "MacOS", "iOS"][i % 4],
          device_type: ["Desktop", "Mobile", "Tablet"][i % 3],
          current_urxl: `https://shop.naijamall.ng/${
            ["checkout", "products", "dashboard", "search"][i % 4]
          }`,
          host: "shop.naijamall.ng",
          pathname: `/${["checkout", "products", "dashboard", "search"][i % 4]}`,
          geoip_country_name: [
            "Nigeria",
            "Kenya",
            "South Africa",
            "Ghana",
          ][i % 4],
          geoip_city_name: [
            "Port Harcourt",
            "Mombasa",
            "Cape Town",
            "Kumasi",
          ][i % 4],
          lib: "insightloop-browser",
          lib_version: "1.102.1",
          viewport_width: 1920,
          viewport_height: 1080,
        },
      });
    }

    const createdFeedbacks = await tx.feedback.createMany({
      data: feedbacks,
    });
    console.log(`Seeded ${createdFeedbacks.count} feedbacks`);

    return {
      user,
      project,
      apiKey,
      endUsers,
      eventsCount: createdEvents.count,
      feedbacksCount: createdFeedbacks.count,
    };
  });

  console.log("Seeding completed successfully!");
  console.log("Summary:", {
    user: result.user.email,
    project: result.project.name,
    apiKey: result.apiKey.name,
    endUsersCount: result.endUsers.length,
    eventsCount: result.eventsCount,
    feedbacksCount: result.feedbacksCount,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
