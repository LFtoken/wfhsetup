# Pomodoro Timer - Floating Desktop Widget
# Compiled to EXE via IExpress

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Media

$csharp = @"
using System;
using System.Drawing;
using System.Windows.Forms;
using System.Drawing.Drawing2D;
using System.Media;
using System.Runtime.InteropServices;

public class PomodoroForm : Form
{
    private System.Windows.Forms.Timer timer;
    private Label timeLabel, statusLabel, sessionLabel;
    private Button startBtn, resetBtn, focusBtn, breakBtn, longBtn, closeBtn;
    private int totalSeconds = 25 * 60;
    private int remaining;
    private bool running = false;
    private int sessions = 0;
    private string currentLabel = "Focus";

    [DllImport("user32.dll")]
    public static extern bool ReleaseCapture();
    [DllImport("user32.dll")]
    public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);

    public PomodoroForm()
    {
        this.Text = "Pomodoro";
        this.Size = new Size(360, 160);
        this.FormBorderStyle = FormBorderStyle.None;
        this.StartPosition = FormStartPosition.CenterScreen;
        this.TopMost = true;
        this.BackColor = Color.FromArgb(30, 30, 46);
        this.ShowInTaskbar = true;
        remaining = totalSeconds;

        this.MouseDown += (s, e) => {
            if (e.Button == MouseButtons.Left) {
                ReleaseCapture();
                SendMessage(Handle, 0xA1, 0x2, 0);
            }
        };

        BuildUI();

        timer = new System.Windows.Forms.Timer();
        timer.Interval = 1000;
        timer.Tick += Tick;
    }

    void BuildUI()
    {
        // Left panel with ring timer
        var leftPanel = new Panel();
        leftPanel.Size = new Size(100, 160);
        leftPanel.Location = new Point(0, 0);
        leftPanel.BackColor = Color.FromArgb(30, 30, 46);
        leftPanel.Paint += (s, e) => {
            var g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            var rect = new Rectangle(8, 10, 84, 84);
            float progress = totalSeconds > 0 ? 1f - (float)remaining / totalSeconds : 1f;

            using (var bgPen = new Pen(Color.FromArgb(49, 50, 68), 5))
                g.DrawArc(bgPen, rect, 0, 360);

            Color ringColor = remaining <= 0 ? Color.FromArgb(166, 227, 161) : Color.FromArgb(203, 166, 247);
            using (var fgPen = new Pen(ringColor, 5) { StartCap = LineCap.Round, EndCap = LineCap.Round })
                g.DrawArc(fgPen, rect, -90, 360 * progress);
        };

        timeLabel = new Label();
        timeLabel.Text = FormatTime(remaining);
        timeLabel.Font = new Font("Segoe UI", 18, FontStyle.Bold);
        timeLabel.ForeColor = Color.FromArgb(245, 224, 220);
        timeLabel.AutoSize = false;
        timeLabel.TextAlign = ContentAlignment.MiddleCenter;
        timeLabel.Size = new Size(100, 28);
        timeLabel.Location = new Point(0, 42);
        timeLabel.BackColor = Color.Transparent;
        leftPanel.Controls.Add(timeLabel);

        statusLabel = new Label();
        statusLabel.Text = "Ready";
        statusLabel.Font = new Font("Segoe UI", 8);
        statusLabel.ForeColor = Color.FromArgb(166, 173, 200);
        statusLabel.AutoSize = false;
        statusLabel.TextAlign = ContentAlignment.MiddleCenter;
        statusLabel.Size = new Size(100, 14);
        statusLabel.Location = new Point(0, 70);
        statusLabel.BackColor = Color.Transparent;
        leftPanel.Controls.Add(statusLabel);

        this.Controls.Add(leftPanel);

        // Right controls panel
        var rightPanel = new Panel();
        rightPanel.Location = new Point(105, 10);
        rightPanel.Size = new Size(250, 140);
        rightPanel.BackColor = Color.FromArgb(30, 30, 46);

        // Preset buttons
        int x = 0, y = 0;
        focusBtn = MakeButton("25m Focus", x, y, 85, 26, true);
        focusBtn.Click += (s, e) => SwitchPreset(25*60, "Focus", focusBtn);
        rightPanel.Controls.Add(focusBtn);
        x += 90;
        breakBtn = MakeButton("5m Break", x, y, 75, 26, false);
        breakBtn.Click += (s, e) => SwitchPreset(5*60, "Break", breakBtn);
        rightPanel.Controls.Add(breakBtn);
        x += 80;
        longBtn = MakeButton("15m Long", x, y, 75, 26, false);
        longBtn.Click += (s, e) => SwitchPreset(15*60, "Long Break", longBtn);
        rightPanel.Controls.Add(longBtn);

        // Start/Reset buttons
        startBtn = new Button();
        startBtn.Text = "Start";
        startBtn.FlatStyle = FlatStyle.Flat;
        startBtn.Size = new Size(90, 32);
        startBtn.Location = new Point(0, 38);
        startBtn.Font = new Font("Segoe UI", 10, FontStyle.Bold);
        startBtn.BackColor = Color.FromArgb(166, 227, 161);
        startBtn.ForeColor = Color.FromArgb(30, 30, 46);
        startBtn.FlatAppearance.BorderSize = 0;
        startBtn.Cursor = Cursors.Hand;
        startBtn.Click += (s, e) => StartPause();
        rightPanel.Controls.Add(startBtn);

        resetBtn = new Button();
        resetBtn.Text = "Reset";
        resetBtn.FlatStyle = FlatStyle.Flat;
        resetBtn.Size = new Size(70, 32);
        resetBtn.Location = new Point(100, 38);
        resetBtn.Font = new Font("Segoe UI", 10, FontStyle.Bold);
        resetBtn.BackColor = Color.FromArgb(49, 50, 68);
        resetBtn.ForeColor = Color.FromArgb(166, 173, 200);
        resetBtn.FlatAppearance.BorderSize = 0;
        resetBtn.Cursor = Cursors.Hand;
        resetBtn.Click += (s, e) => Reset();
        rightPanel.Controls.Add(resetBtn);

        // Session counter
        sessionLabel = new Label();
        sessionLabel.Text = "0 sessions";
        sessionLabel.AutoSize = true;
        sessionLabel.Font = new Font("Segoe UI", 8);
        sessionLabel.ForeColor = Color.FromArgb(108, 112, 134);
        sessionLabel.Location = new Point(0, 80);
        rightPanel.Controls.Add(sessionLabel);

        // Close button
        closeBtn = new Button();
        closeBtn.Text = "X";
        closeBtn.FlatStyle = FlatStyle.Flat;
        closeBtn.Size = new Size(24, 24);
        closeBtn.Location = new Point(220, 110);
        closeBtn.Font = new Font("Segoe UI", 8, FontStyle.Bold);
        closeBtn.BackColor = Color.FromArgb(49, 50, 68);
        closeBtn.ForeColor = Color.FromArgb(166, 173, 200);
        closeBtn.FlatAppearance.BorderSize = 0;
        closeBtn.Cursor = Cursors.Hand;
        closeBtn.Click += (s, e) => Application.Exit();
        rightPanel.Controls.Add(closeBtn);

        this.Controls.Add(rightPanel);
    }

    Button MakeButton(string text, int x, int y, int w, int h, bool active)
    {
        var btn = new Button();
        btn.Text = text;
        btn.FlatStyle = FlatStyle.Flat;
        btn.Size = new Size(w, h);
        btn.Location = new Point(x, y);
        btn.Font = new Font("Segoe UI", 8, active ? FontStyle.Bold : FontStyle.Regular);
        btn.BackColor = active ? Color.FromArgb(203, 166, 247) : Color.FromArgb(49, 50, 68);
        btn.ForeColor = active ? Color.FromArgb(30, 30, 46) : Color.FromArgb(166, 173, 200);
        btn.FlatAppearance.BorderSize = 0;
        btn.Cursor = Cursors.Hand;
        return btn;
    }

    void SwitchPreset(int seconds, string label, Button activeBtn)
    {
        timer.Stop();
        running = false;
        totalSeconds = seconds;
        remaining = totalSeconds;
        currentLabel = label;
        startBtn.Text = "Start";
        startBtn.BackColor = Color.FromArgb(166, 227, 161);
        statusLabel.Text = "Ready";
        Button[] btns = { focusBtn, breakBtn, longBtn };
        foreach (var b in btns) {
            b.BackColor = Color.FromArgb(49, 50, 68);
            b.ForeColor = Color.FromArgb(166, 173, 200);
            b.Font = new Font("Segoe UI", 8, FontStyle.Regular);
        }
        activeBtn.BackColor = Color.FromArgb(203, 166, 247);
        activeBtn.ForeColor = Color.FromArgb(30, 30, 46);
        activeBtn.Font = new Font("Segoe UI", 8, FontStyle.Bold);
        UpdateDisplay();
        this.Invalidate();
    }

    void StartPause()
    {
        if (running)
        {
            timer.Stop();
            running = false;
            startBtn.Text = "Resume";
            startBtn.BackColor = Color.FromArgb(249, 226, 175);
            statusLabel.Text = "Paused";
        }
        else
        {
            if (remaining <= 0) remaining = totalSeconds;
            timer.Start();
            running = true;
            startBtn.Text = "Pause";
            startBtn.BackColor = Color.FromArgb(249, 226, 175);
            statusLabel.Text = currentLabel;
        }
    }

    void Reset()
    {
        timer.Stop();
        running = false;
        remaining = totalSeconds;
        startBtn.Text = "Start";
        startBtn.BackColor = Color.FromArgb(166, 227, 161);
        statusLabel.Text = "Ready";
        UpdateDisplay();
        this.Invalidate();
    }

    void Tick(object sender, EventArgs e)
    {
        if (remaining <= 0)
        {
            timer.Stop();
            running = false;
            startBtn.Text = "Start";
            startBtn.BackColor = Color.FromArgb(166, 227, 161);
            if (currentLabel == "Focus") {
                sessions++;
                sessionLabel.Text = sessions + " sessions";
            }
            statusLabel.Text = "Done!";
            SystemSounds.Beep.Play();
            this.Invalidate();
            return;
        }
        remaining--;
        UpdateDisplay();
        this.Invalidate();
    }

    void UpdateDisplay()
    {
        timeLabel.Text = FormatTime(remaining);
    }

    string FormatTime(int sec)
    {
        int m = sec / 60, s = sec % 60;
        return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies "System.Windows.Forms","System.Drawing"

$form = New-Object PomodoroForm
$form.ShowDialog()
